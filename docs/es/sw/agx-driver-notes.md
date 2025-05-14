---
title: Notas del Controlador AGX
---

## Documentación general
* [Guía de Supervivencia del Controlador de Alyssa](https://rosenzweig.io/AlyssasDriverSurvivalGuide.txt)
* [AGX](../hw/soc/agx.md) (algo desactualizado)

## Enlaces de Git
* [Mesa Upstream](https://gitlab.freedesktop.org/mesa/mesa) ([solicitudes de fusión](https://gitlab.freedesktop.org/mesa/mesa/-/merge_requests?label_name%5B%5D=asahi))
* [Mesa Asahi](https://gitlab.freedesktop.org/asahi/mesa) (los lanzamientos `mesa-asahi-edge` se cortan desde aquí)
* [Rama WIP del kernel de Lina](https://github.com/AsahiLinux/linux/tree/gpu/rust-wip) (UAPI puede estar desincronizado con mesa)

## Diseño de UAPI

El diseño de [UAPI](https://github.com/AsahiLinux/linux/blob/asahi-wip/include/uapi/drm/asahi_drm.h) está inspirado en el próximo [UAPI de Intel Xe](https://cgit.freedesktop.org/drm/drm-xe/tree/include/uapi/drm/xe_drm.h?h=drm-xe-next).

* File: Un descriptor de archivo abierto al dispositivo DRM
* VM: Un espacio de direcciones de GPU
* Bind: Un mapeo desde un objeto GEM a una VM
* Queue: Una cola de ejecución lógica en la GPU (respaldada por varias colas de firmware)

### Objetos GEM y VMs

Los objetos GEM pueden crearse privados para una VM dada. Esto significa que el objeto nunca puede exportarse y solo puede vincularse a esa VM. Esto permite que el controlador optimice el bloqueo de objetos (aún no implementado, será necesario una vez que tengamos un shrinker, pero el controlador ya hace cumplir el requisito de objeto privado).

* TODO: ¿Tiene sentido ofrecer un ioctl para convertir un objeto privado en uno compartido? El controlador necesita esto para algunos flujos de GL, actualmente termina reasignando y copiando lo cual no es ideal...

El ioctl de vinculación de VM soporta vincular/desvincular rangos arbitrarios de un objeto GEM en una VM, aunque el controlador aún no implementa esto (requiere que todo el objeto esté vinculado en espacio libre de VM, y los objetos solo pueden desvincularse completamente por nombre de objeto, no por rango VMA). Esto cambiará en el futuro, la UAPI ya está preparada para ello.

### Colas

¡Lector, ten cuidado: ¡Esto es complicado!

La UAPI expone un número arbitrario de colas de usuario. Cada cola de usuario tiene una VM padre. Una cola de usuario recibe trabajos para ejecución, y cada trabajo puede estar compuesto de hasta 64 comandos de GPU (para garantizar que no excedamos ciertas limitaciones del firmware). Los trabajos son programados por el programador `drm_sched` y soportan listas arbitrarias de objetos de sincronización de entrada/salida, para sincronización explícita. El trabajo no comienza la ejecución hasta que todos los objetos de sincronización de entrada estén señalizados, y los objetos de sincronización de salida se señalizan cuando todos los comandos en el trabajo se han completado completamente. Los trabajos se envían al firmware tan pronto como todos los objetos de sincronización de entrada estén señalizados: un límite de trabajo NO implica un viaje de ida y vuelta a la CPU si no hay dependencias directas entre ellos (aunque la GPU señalizará asincrónicamente la finalización de cada trabajo, ya que el kernel necesita limpiar recursos). Sin embargo, los trabajos *siempre* se envían en orden: los objetos de sincronización de entrada no satisfechos para un trabajo bloquearán el envío de todos los trabajos posteriores al firmware (esto está implícito en `drm_sched` y también es un requisito estricto del diseño del controlador tal como está hoy). La verdadera concurrencia/reordenamiento arbitrario requiere usar múltiples colas.

Dentro de un trabajo, los comandos se ponen en cola directamente para ejecución por el firmware sin participación de la CPU. Cada cola de usuario está lógicamente compuesta de dos colas lógicas: render y compute. Los comandos de render y compute se envían en secuencia, pero pueden ejecutarse concurrentemente dentro de una sola cola de usuario.

La cola lógica de render está respaldada por dos colas de firmware (vertex y fragment). El kernel siempre envía comandos de firmware en pares a estas, con una barrera entre ellos. Esta barrera es permeable (inserte magia de firmware aquí ✨) en que los renders parciales y la expropiación pueden intercalar ejecuciones parciales de vertex y fragment. Las barreras vertex/fragment entre comandos de dibujo individuales, si son necesarias, se manejan a nivel VDM (en el flujo de comandos de la GPU), al igual que ciertas barreras relacionadas con la caché.

Dentro de una cola de usuario, se pueden agregar opcionalmente dependencias de comandos. Estas se especifican como el índice de límite (piense en indexación de slice de Python) del comando en el que esperar para cada cola lógica (compute, render), por comando. Los índices comienzan en 0 (el punto antes de cualquier comando de este envío) y se incrementan en uno por cada comando enviado de un tipo dado. Es ilegal esperar en un límite de comando en el futuro. Esperar en el índice 0 (el comienzo del trabajo) para una cola lógica dada significa esperar a que se completen todos los comandos parte de trabajos *previos* de ese tipo, es decir, es equivalente a esperar en el límite final del envío previo. Dado que las colas lógicas siempre comienzan y completan comandos en secuencia, esperar en un índice dado implica esperar en todos los comandos previos para esa cola lógica.

En ausencia de barreras explícitas, la mitad vertex de los comandos de render puede ejecutarse concurrentemente con la mitad fragment de comandos previos. Es decir, el procesamiento vertex puede "adelantarse" al procesamiento fragment. Para prevenir esto, especifica una barrera de comando del índice de comando previo. Esto es un no-op para compute, ya que solo hay una única cola de firmware serializada en ese caso, pero tiene significado para comandos de render, y se recomienda para comandos compute en caso de que se vuelva disponible más paralelización en el futuro.

Considera el siguiente envío:

```
#0  R1 barrier=[__, C0]
#1  C1 barrier=[__, __]
#2  C2 barrier=[__, __]
#3  R2 barrier=[R1, C2]
#4  R3 barrier=[__, __] # [R1, C2] implícito
#5  R4 barrier=[R3, __] # [R3, C2] implícito
```

Esto describe el siguiente grafo de dependencias:

```
[C*]->[R1]----+----\
   [C1]------+|---vv
   [C2]-----+||->[R3]-v
            vvv      [R4]
            [R2]------^
```
Nota que hay un orden C1<-C2 en la práctica debido a la serialización de cola, pero esto no se especificó explícitamente con barreras. Sin embargo, R2 y R3 están ordenados después de C2 y todos los comandos compute previos, lo que incluye C1, y también ordenados después de R1. También nota que R2/R3 pueden ejecutarse concurrentemente (lo que significa que el procesamiento vertex para R3 puede superponerse con o preceder al procesamiento fragment para R2), pero R4 no comenzará su mitad vertex hasta que R3 esté completamente completo (lo que implica que R2 también está completo, debido al orden de cola).

`[C*]` es el último comando compute enviado (de un trabajo previo). Nota que especificar una barrera 0 es legal incluso si no se han enviado comandos aún (se ignora en ese caso, ya que es equivalente al caso donde todos los comandos previos se han completado completamente en el controlador y las primitivas de ordenamiento asociadas liberadas). En este caso, R1 podría comenzar su procesamiento vertex antes de que se complete el procesamiento fragment de un envío previo (sin barrera de render), pero esperaría a que se completen cualquier comando compute previo (barrera C0).

La vista de cola de firmware del mismo trabajo es:
```
Compute  Vertex    Fragment
RUN C1   WAIT C0   WAIT R1v
RUN C2   RUN  R1v  RUN  R1f
         WAIT R1f  WAIT R2v
         WAIT C2   RUN  R2f
         RUN R2v   WAIT R3v
         RUN R3v   RUN  R3f
         WAIT R3f  WAIT R4v
         RUN R4v   RUN  R4f
```

En otras palabras: para cada comando de render, las esperas de barrera explícitas van en la cola vertex antes de la mitad vertex, luego la cola fragment siempre obtiene una barrera implícita antes de la mitad fragment.

El soporte para comandos Blit se agregará en un controlador futuro. Estos son efectivamente comandos de render solo-fragment, y por lo tanto tendrán sus barreras explícitas y ejecución dentro de la cola fragment.

Actualmente, el controlador Gallium solo emite envíos de comando único y siempre usa barreras `[C0, R0]` para serializar todo completamente. Esto podría mejorarse en el futuro, pero el caso de uso principal para todo esto son las colas Vulkan.

### Resultados

El espacio de usuario puede solicitar opcionalmente retroalimentación de la ejecución de comandos. Esto se hace especificando un BO de búfer de resultados, y luego desplazamientos y tamaños por comando en ese búfer. El kernel escribirá información de resultado del comando allí, una vez que el comando esté completo. Actualmente, esto incluye información básica de temporización, estadísticas de búfer de vértices en mosaico y conteos de render parcial (para comandos de render), e información detallada de fallos (para comandos con fallos, ¡muy útil cuando se combina con alguna lógica de búsqueda de BO en mesa!).

### FAQ

* **¿Qué pasa con el lío de `struct drm_asahi_cmd_render`?**
  Los comandos del firmware especifican directamente todos estos detalles de bajo nivel de render y no podemos exponer esas estructuras directamente al espacio de usuario, ya que no es seguro hacerlo. No hay otra manera, y macOS hace lo mismo... (¡al menos es menos lío que PowerVR!)

### TODO

Bloqueadores de upstreaming (afectan al borrador actual de UAPI):

* [ ] Averiguar las flags de adjunto y confirmar exactamente qué hace/cómo funciona
* [ ] Resolver las cosas del kernel de expropiación compute y los campos de comando que usa (o eliminarlo y dejarlo para una revisión futura/flag de característica)
* [ ] Averiguar uno o dos búferes desconocidos restantes y si deberían ir en la UAPI (la cosa 02345...)
* [ ] Agregar las abstracciones faltantes para mmu.rs (cosas de memremap)

Otros:

* [ ] Implementar `DRM_IOCTL_ASAHI_GET_TIME`
* [ ] Implementar RTKit runtime-PM (dormir ASC cuando la GPU está inactiva, macOS hace esto en laptops)
* [ ] Ingeniería inversa e implementar comandos blit
* [ ] Conectar KTrace del firmware a tracing de Linux
* [ ] Completar la gestión de VM (mapeos/desmapeos de subrango arbitrario)
* [ ] Contadores de rendimiento
* [ ] Soporte para M2 Pro/Max 