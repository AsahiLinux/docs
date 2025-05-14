---
title: Introducción a Apple Silicon
---

## Prólogo

Este documento intenta explicar el ecosistema de arranque de los Mac con Apple Silicon (es decir, M1 y posteriores) (en adelante "Mac AS"), en lo que respecta a cómo los sistemas operativos abiertos interoperan con la plataforma.

Está dirigido a desarrolladores y mantenedores de distribuciones Linux, BSD y otros sistemas operativos y componentes relacionados con el arranque, así como a usuarios interesados en la plataforma, y su objetivo es cubrir el panorama general sin entrar en detalles técnicos excesivos. Los detalles específicos deben dejarse para otras páginas. También omite detalles que solo conciernen a macOS (como el funcionamiento y carga de las extensiones de kernel).

La información aquí se basa en cómo funcionan las cosas en el firmware del sistema y versiones de macOS 12.0 (Monterey) y posteriores. Se produjeron varios cambios de diseño rápidos en el primer año tras el anuncio inicial del Mac M1; aunque los firmwares 11.x antiguos son utilizables, están obsoletos y presentan varios errores, y tratar de cubrir estos cambios haría todo demasiado confuso. Esperamos que los usuarios que deseen ejecutar sistemas operativos abiertos utilicen firmware de sistema correspondiente a macOS 12.1 o posterior, por razones prácticas (aunque pueden tener versiones más antiguas de macOS instaladas).

Por favor, visita #asahi en OFTC si tienes preguntas generales o comentarios, o contacta en #asahi-dev si eres desarrollador y deseas discutir aspectos técnicos ([más información](https://asahilinux.org/community/)).

## Objetivos de diseño

Los Mac AS tienen los siguientes objetivos de diseño:

* Hechos para macOS
* Abiertos a otros sistemas operativos
* Arranque seguro obligatorio (con control del usuario)
* Seguridad incluso contra atacantes con acceso físico
* Resistencia a ataques en la cadena de suministro
* Defensa en profundidad (sin confianza ciega en coprocesadores/firmware)
* Arranque dual/múltiple nativo con compatibilidad hacia atrás
* A prueba de bloqueos (brick-proof)
* Seguridad recuperable (puede restaurarse a un estado conocido por el usuario)

Ten en cuenta estos objetivos de diseño al leer este documento, ya que explican muchas de las decisiones que se tomaron en la arquitectura del sistema. El enfoque de Apple hacia los sistemas operativos de terceros es esencialmente "diviértanse". No tenemos expectativas de soporte directo, documentación o esfuerzo de desarrollo adicional por su parte, ni esperamos que intenten obstaculizar deliberadamente los sistemas operativos de terceros. Han desarrollado explícitamente la capacidad de ejecutar de forma segura sistemas operativos y bootloaders de terceros en estas máquinas, y han dejado el resto a nosotros.

Apple documenta gran parte de su diseño de seguridad en su [guía de seguridad de la plataforma](https://support.apple.com/guide/security/welcome/web), que debe considerarse la referencia autorizada para estas plataformas. Sin embargo, la guía no entra en los puntos técnicos finos del sistema, y hemos aprendido muchos detalles adicionales mediante experimentación e ingeniería inversa.

Estos sistemas están diseñados para ejecutar macOS y no hacen concesiones explícitas para soportar otros sistemas operativos; la capacidad de arrancar kernels personalizados puede verse como soporte oficial para compilaciones propias del [kernel de macOS](https://github.com/apple-oss-distributions/xnu.git), y los sistemas operativos que no sean macOS deben comportarse como lo hace macOS en cuanto a sus interacciones con el resto de la plataforma. En otras palabras, la especificación ABI para cada aspecto del arranque y la interacción con el firmware es "lo que haga macOS". No hay intento de forzar el uso real de macOS (no hay comprobaciones maliciosas ni nada por el estilo), por lo que el sistema está abierto a cualquier sistema operativo siempre que siga el ABI de arranque de macOS.

### Sobre el arranque seguro, el control del usuario y las licencias

Sería negligente no cubrir brevemente la posición de estas máquinas en cuanto al control del usuario y la confiabilidad. Las máquinas Apple Silicon están diseñadas ante todo para proporcionar un entorno seguro para usuarios finales típicos que ejecutan macOS firmado por Apple; priorizan la seguridad del usuario frente a atacantes de terceros, pero también intentan limitar el control de Apple sobre las máquinas para reducir su responsabilidad ante solicitudes gubernamentales, hasta cierto punto. Además, el diseño preserva la seguridad incluso cuando se instala un sistema operativo de terceros. Toda la arquitectura es compleja y los detalles sutiles, pero para resumir algunos puntos clave:

* Los componentes de arranque están firmados y son opacos (encriptados)
* Los componentes en tiempo de ejecución (por ejemplo, firmware y macOS) están firmados y son transparentes (texto plano)
    * Con la excepción del SEP (Secure Enclave Processor, equivalente a TPM), que es opcional y está deshabilitado por defecto
    * Y dos pequeños blobs (SMC y PMU) que están encriptados incidentalmente; sería bueno que Apple los divulgara, pero tienen una superficie de E/S muy pequeña.
* La recuperación total del sistema (DFU) requiere conexión a internet
* La operación normal, incluidas instalaciones de sistemas operativos, puede realizarse sin conexión con presencia física del usuario. Es posible tomar un Mac nuevo y instalar Linux sin conectarlo nunca a una red.
* El control del propietario se establece en el primer arranque (te conviertes en propietario al completar la configuración de macOS y crear el primer usuario administrador).
* El flujo normal del bootloader es mínimo y tiene una superficie de ataque pequeña (sin USB, red, etc.)
* Ningún blob en tiempo de ejecución está diseñado para tener acceso total al sistema (no hay ME, PSP, TrustZone, etc.). Casi todos los blobs se ejecutan detrás de IOMMUs u otros firewalls, con la única excepción del firmware de la GPU". Todo el código que se ejecuta en las CPUs principales está bajo control del sistema operativo.

Esto los sitúa en algún punto entre los PCs x86 y un sistema orientado a la libertad como el [Talos II](https://www.raptorcs.com/TALOSII/) en cuanto a la libertad para reemplazar firmware y componentes de arranque; aunque se requieren varios blobs para arrancar el sistema, ninguno de ellos puede tomar el control del sistema operativo o comprometerlo después del arranque (a diferencia, por ejemplo, de Intel ME y AMD PSP en sistemas recientes, o los chips con capacidad DMA en el bus LPC que ejecutan blobs opacos incluso en [ThinkPads antiguos](https://ryf.fsf.org/products/TET-X200)).

Las máquinas AS usan numerosos blobs de firmware auxiliares, cada uno dedicado a un propósito específico y ejecutándose en un núcleo de CPU separado. Esto es mejor que tener menos blobs "todo en uno" (como Intel ME), ya que cada blob solo puede afectar a un subsistema concreto (por ejemplo, pantalla, almacenamiento, cámara), lo que dificulta que varios blobs colaboren para comprometer al usuario de forma significativa. Por ejemplo, el blob que se ejecuta dentro del controlador de teclado no tiene mecanismo para comunicarse con el blob de la tarjeta WiFi, y por tanto no puede implementar un keylogger subrepticio; el blob del controlador de pantalla tampoco puede comunicarse con la red, y por tanto no puede implementar un capturador de pantalla secreto.

Desde una perspectiva de seguridad, estas máquinas pueden calificar como las computadoras de propósito general más seguras disponibles para el público que soportan sistemas operativos de terceros, en cuanto a resistencia a ataques por parte de no propietarios. Esto, por supuesto, depende de cierto nivel de confianza en Apple, pero algún nivel de confianza en el fabricante es necesario para cualquier sistema (no hay forma de probar la inexistencia de puertas traseras de hardware en ninguna máquina, así que esto no es tan problemático como podría parecer).

Este diseño hace que instalar un sistema operativo de terceros sea algo más incómodo de lo habitual en otras plataformas (esto es estándar para proteger contra malware y que los usuarios sean engañados para comprometer sus máquinas), y esto se cubre en el resto de esta guía.

Sobre las licencias:

* Debes aceptar el EULA de Apple para usar las máquinas.
* Apple da permiso explícito a los usuarios para ejecutar su propio sistema operativo en su EULA.
* Apple no da permiso para redistribuir el firmware del sistema, pero
* Apple proporciona todas las versiones actuales y pasadas de imágenes completas del sistema (firmware y macOS) en un CDN HTTPS bien conocido y sin autenticación, y
* El EULA de Apple otorga a todos los propietarios de Mac una licencia para usar estas imágenes.

Como en todos los EULA, hay puntos sin sentido en el de Apple (los abogados siempre parecen estar desincronizados con la dirección real del producto y el diseño), pero leyendo entre líneas creemos que todo lo que hacemos es correcto para fines prácticos.

\* Hay un blob excepcional que sí tiene acceso privilegiado al sistema (aunque no hace nada cuestionable explícitamente): el firmware de la GPU. Esto se debe a que gestiona partes de las tablas de páginas de la GPU (que también son suyas), y no hay un IOMMU upstream separado delante del coprocesador de la GPU como ocurre con otros coprocesadores. Aunque esto amplía la superficie de compromiso del sistema, cabe señalar que este firmware no es especialmente grande, se distribuye en texto plano e incluso con algunos símbolos, no tiene funcionalidad para comunicarse por interfaces dudosas (red, etc.), y es opcional y no se ejecuta cuando arranca el sistema operativo (el SO debe iniciarlo explícitamente). Por tanto, los usuarios que deseen prescindir de la funcionalidad de la GPU pueden optar por no usarlo. El firmware también implementa una mitigación similar a la [PPL](http://newosxbook.com/articles/CasaDePPL.html) para proteger las tablas de páginas de la GPU incluso si se ve comprometido mediante explotación (por ejemplo, a través de comandos de GPU), Actualización: Desde macOS 13.0, el firmware de la GPU está significativamente reforzado (en parte gracias al descubrimiento y reporte de Lina de CVE-2022-32947). Asahi ahora distribuye firmware 13.5, lo que aumenta significativamente nuestra confianza en esta parte del sistema. No obstante, por ahora, no tenemos motivos para creer que existan puertas traseras en los firmwares 12.3/12.4 que usamos, o que sea posible explotarlos desde Linux. 