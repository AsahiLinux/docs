---
title: Error de Pantalla en macOS Sonoma
---

## ACTUALIZACIÓN CRÍTICA

Con macOS 14.1.1, 14.2 beta 2, ~~y (probablemente) 13.6.2~~, Apple "arregló" el error haciendo que la configuración de ProMotion no cambie el modo de pantalla al arranque.

**Desafortunadamente, olvidaron restablecer realmente el modo de pantalla al arranque a la configuración segura (ProMotion), lo que significa que los usuarios afectados que actualizan con ProMotion desactivado ahora están atrapados permanentemente en un estado roto. Para empeorar las cosas, no tenemos idea de cómo detectar esta condición de manera preventiva en macOS.**

Para empeorar aún más las cosas, Apple todavía no está forzando un avance de Recuperación del Sistema a 14.x, lo que significa que la gran mayoría de los usuarios estarán en el peor caso de estado peligroso donde, si ocurre el error, no hay recuperación posible.

Todavía esperamos que Apple arregle esto correctamente en una versión futura, pero no tenemos la más mínima idea de cómo pensaron que esta "solución" interina era una buena idea. Solo hace las cosas aún más confusas y silenciosamente mortales para los usuarios afectados.

Como resultado de esta actualización, ahora estamos bloqueando directamente las instalaciones de Asahi Linux en el subconjunto de sistemas afectados con Recuperación del Sistema desactualizada (probablemente la gran mayoría de usuarios con máquinas de 14" y 16" y macOS actualizado), por razones de seguridad. Lo sentimos. Lo intentamos, pero nos rendimos tratando de parchear el problema por nuestro lado o detectar los casos problemáticos de antemano para nuestros usuarios. Apple rompió esto, solo Apple puede arreglarlo, y necesitan arreglarlo de la manera correcta. No hay nada más que podamos hacer.

La única solución en este momento es hacer una Revive DFU preventiva usando otra Mac, lo que forzará una actualización de la Recuperación del Sistema y al menos dejará tu sistema con un mecanismo de seguridad funcional. El problema aún podría ocurrir mientras instalas Asahi en este caso, pero al menos podrás volver a macOS (si esto sucede, aún estarás atrapado sin Asahi hasta que Apple arregle esto). El instalador permitirá la instalación para usuarios con una Recuperación del Sistema actualizada, con una advertencia.

## ¿Qué sucedió?

**Actualización 2023-11-09: Apple ha lanzado Ventura 13.6.2 con un supuesto arreglo para este error. En este punto, creemos que esta es una solución interina para evitar la peor situación que afecta a usuarios de Ventura de arranque único (ver la última sección de este documento), y NO aún una solución completa. Los usuarios de arranque múltiple y (en menor medida) de Asahi Linux siguen afectados de la misma manera. Esperamos que una solución mayor/completa probablemente llegue con el lanzamiento de Sonoma 14.2 (actualmente en beta, aún no arreglado en beta 1).**

**Actualización: Hemos realizado cambios en el Instalador de Asahi, en nuestro cargador de arranque m1n1, y en asahi-nvram. En este momento, creemos que instalar o haber instalado Asahi no debería introducir ningún peligro adicional sobre una actualización vanilla de Sonoma en una máquina de arranque único.**

macOS Sonoma y macOS Ventura 13.6 fueron lanzados con múltiples errores graves en su proceso de actualización y arranque. Combinados, estos errores pueden crear condiciones donde una máquina siempre arranca a una pantalla negra, sin importar qué combinación de pulsación del botón de encendido se use. Esto deja a los usuarios atrapados, y la única solución es usar recuperación DFU.

**Este error puede afectar tanto a usuarios con como sin Asahi Linux instalado.**

Esta situación puede ocurrir con ciertas configuraciones en ciertos modelos, cuando múltiples versiones de macOS están instaladas lado a lado (una Sonoma, una anterior). Dado que Asahi Linux se comporta como si fuera macOS 12.3/12.4/13.5 (dependiendo del modelo y tiempo de instalación), las instalaciones de arranque dual de macOS Sonoma y Asahi Linux tienen el mismo efecto. Para macOS 13.6, esta situación ni siquiera requiere un sistema de arranque dual, y puede ser activada de forma independiente como el único sistema operativo instalado.

**Hemos actualizado el instalador de Asahi Linux para realizar automáticamente una verificación de integridad y diagnosticar tu sistema al inicio**. Para ejecutarlo, pega este comando en Terminal en macOS:

`curl https://alx.sh | sh`

Puedes salir del instalador una vez que llegues al menú principal, sin hacer ningún cambio en tu sistema.

Reportes de errores de Apple: FB13319681 y FB13319708 y FB13313702 

## ¿Cuáles son exactamente los errores?

Hay dos errores:

* Las actualizaciones de macOS Sonoma usan la versión previamente instalada como Recuperación del Sistema. Esto tiene sentido, pero no considera problemas de compatibilidad hacia atrás entre RecoveryOS más antiguo y firmware más nuevo. Si esta incompatibilidad hace que recoveryOS falle al arrancar, esto dejará la Recuperación del Sistema inutilizable.

* Para modelos de 14" y 16": Una vez que el Firmware del Sistema se actualiza a la versión de macOS Sonoma, si la pantalla está configurada a una tasa de refresco diferente a ProMotion, ese sistema ya no podrá arrancar correctamente en instalaciones más antiguas de macOS ni en Asahi Linux. Esto incluye el modo de recuperación cuando esos sistemas están configurados como el sistema operativo de arranque predeterminado, **y también la Recuperación del Sistema** al menos hasta la próxima actualización del sistema operativo. \*

\* Asahi Linux en particular, algo curiosamente, aún arrancará a una pantalla de inicio de sesión en este caso, pero la salida del cargador de arranque (U-Boot / GRUB) no será visible. Esto es porque nuestro controlador de pantalla de Linux puede recuperarse afortunadamente del escenario de pantalla mal configurada, mientras que el controlador de macOS no puede. Sin embargo, aún estarás en problemas, ya que no podrás usar el Selector de Arranque (que es recoveryOS) para cambiar de vuelta a macOS.

## ¿Qué sucede si me afecta el error? ¿Perderé datos?

Necesitarás otra Mac para recuperarte del fallo usando el modo DFU. Sin embargo, *no* perderás datos.

## ¿Qué máquinas están afectadas?

Los modelos de MacBook Pro con pantallas ProMotion (14" y 16") están afectados por el error de arranque de pantalla negra.

## ¿Qué versiones están afectadas?

* ~~macOS Sonoma 14.0+ (no arreglado al 2023-10-31)~~
* ~~macOS Ventura 13.6+ (usa firmware 14.0)~~
* ~~macOS Monterey 12.7 (no está claro, algunos reportes de firmware 13.6 y algunos de 14.0, asume que está afectado por si acaso)~~

**ACTUALIZACIÓN IMPORTANTE**: Acabamos de enterarnos de que el proceso estándar de actualización de software siempre actualizará a la última versión del firmware, incluso cuando solicitas manualmente una versión específica de macOS. Por esta razón, **TODAS** las actualizaciones de macOS realizadas después del lanzamiento de macOS Sonoma están afectadas, independientemente de la versión objetivo. Instalar versiones más antiguas descargará silenciosamente el firmware de Sonoma.

## ¿Qué debo hacer?

### No he actualizado a macOS Sonoma (o macOS Ventura 13.6) aún y quiero hacerlo

Recomendamos esperar hasta que estos problemas sean arreglados por Apple antes de actualizar. Si quieres arriesgarte y tienes una máquina de 14" o 16", **asegúrate de que la tasa de refresco de la pantalla esté configurada en ProMotion** antes de intentar la actualización. Podrías terminar con una Recuperación del Sistema corrupta, que solo puede arreglarse con modo DFU o una actualización exitosa posterior.

Independientemente de si planeas instalar Asahi Linux o no, recomendamos ejecutar el instalador de Asahi Linux después de una actualización de Sonoma para verificar el estado de tu partición de Recuperación del Sistema. Te informará sobre cualquier problema antes del menú principal, antes de que se realicen cambios en tu sistema.

**Si solo quieres instalar Asahi Linux**: macOS 13.5 es seguro para actualizar. Para descargar un instalador específicamente para 13.5, ejecuta `softwareupdate --fetch-full-installer --full-installer-version 13.5`. No olvides eliminar el instalador una vez que hayas terminado con la actualización, para ahorrar espacio en disco.

### No he actualizado a macOS Sonoma (o macOS Ventura 13.6) aún y no tengo prisa

Siéntete libre de permanecer en la versión 13.5 de macOS o anterior por el momento. Puedes instalar Asahi Linux de forma segura si lo deseas.

### Ya he actualizado a macOS Sonoma y quiero instalar Asahi Linux

El instalador de Asahi Linux ha sido actualizado para verificar la versión de tu Recuperación del Sistema, y te informará de los riesgos si hay una incompatibilidad. También verificará la tasa de refresco de ProMotion, y se negará a instalar si está configurada en cualquier modo que no sea ProMotion. Por lo tanto, es seguro instalar en este momento.

Inicia el proceso de instalación normalmente. Sigue las indicaciones cuidadosamente y lee toda la información impresa. Si la versión de tu Recuperación del Sistema es incompatible, asegúrate de entender los riesgos. Si tu tasa de refresco de pantalla es incorrecta, el instalador te pedirá que la cambies.

### Ya he actualizado a macOS Sonoma y tengo Asahi Linux

Si actualmente estás arrancado en macOS, asegúrate de que la tasa de refresco de la pantalla esté configurada en ProMotion (para máquinas de 14" y 16").

Recomendamos ejecutar el instalador de Asahi Linux nuevamente para verificar la integridad de tu partición de RecoveryOS y el estado de ProMotion. Si hay un problema, deberías abstenerte de hacer cambios importantes en tu sistema hasta que el problema sea arreglado por Apple.

### Estoy afectado por el problema, ¿qué hago?

Si tu máquina arranca a una pantalla negra (breve logo de Apple, luego nada), primero intenta un arranque normal de recoveryOS apagando completamente la máquina, luego manteniendo presionado el botón de encendido.

Si eso no funciona, intenta arrancar en RecoveryOS del Sistema. Para hacer esto, apaga completamente la máquina, y luego realiza un gesto rápido de "toque-y-mantener" en el botón de encendido (presiona y suelta una vez, luego presiona y mantén).

**Actualización: Si estás atrapado en Asahi Linux (los pasos anteriores no funcionan para llegar a un selector de arranque para cambiar a macOS, pero tu máquina por lo demás arranca normalmente en Asahi), deberías poder usar `asahi-bless` (disponible en Fedora) para cambiar de vuelta a Sonoma directamente desde Linux y resolver el problema.**.

Si eso tampoco funciona, desafortunadamente tendrás que recurrir al modo DFU. Ver la siguiente sección para detalles.

Si puedes llegar exitosamente a un menú de arranque, selecciona tu instalación de macOS Sonoma y mantén presionada la tecla Opción mientras confirmas tu selección para hacerla el sistema operativo de arranque predeterminado. **Si tienes macOS 13.6 Ventura en su lugar, sigue la sección especial a continuación.**

### ¿Cómo arreglo mi máquina con modo DFU?

Primero, necesitarás otra Mac ejecutando una versión reciente de macOS (una Mac Intel está bien). Instala Apple Configurator desde la App Store en la otra Mac y ábrelo.

Sigue las instrucciones de [Apple](https://support.apple.com/en-gu/guide/apple-configurator-mac/apdd5f3c75ad/mac) para conectar tus dos máquinas juntas, y poner tu máquina objetivo en modo DFU. La pantalla de la máquina objetivo debería permanecer apagada en este punto.

Deberías ver un gran ícono "DFU" en Apple Configurator. Si ves algo más, la máquina no está en el modo correcto. Repite el procedimiento e inténtalo de nuevo.

Una vez que veas el ícono DFU, haz clic derecho en él y selecciona Avanzado → Revive. Esto comenzará el proceso de revive.

Si recibes un mensaje diciendo "Se requiere una actualización del sistema para este dispositivo", puedes ignorarlo y presionar "Restaurar de todos modos". Este proceso ha sido probado con otra Mac ejecutando macOS 13.5.

Sigue las indicaciones y acepta cualquier solicitud de conexión de accesorios. No dejes la máquina desatendida, ya que podrías perderte una de esas indicaciones (y hay un tiempo de espera). El proceso tomará unos minutos para completarse.

Una vez que el proceso de Revive se complete, la máquina debería arrancar en Recuperación de macOS. Sigue las indicaciones y autentícate.

Después de esto, la máquina se reiniciará en el Selector de Arranque.

**Si tienes macOS 13.6 Ventura en su lugar, sigue la sección especial a continuación.**

Selecciona tu instalación de macOS Sonoma, luego ve a la página de configuración de Pantalla y configura la tasa de refresco de la pantalla en ProMotion. Esto evitará que el problema vuelva a ocurrir.

Si terminas con un "arranque de pantalla negra" nuevamente después de este punto, sigue los pasos en la sección anterior para realizar el gesto de "toque-y-mantener" en el botón de encendido. Esto debería funcionar correctamente ahora, ya que tu RecoveryOS del Sistema ha sido actualizado. Luego puedes seleccionar macOS nuevamente y arreglar la tasa de refresco de la pantalla.

### ¡No tengo otra Mac para usar el modo DFU! ¿Qué hago?

Puedes llevar tu Mac a la Apple Store y pedirles que hagan un **Revive DFU**. Asegúrate de que **no** hagan un Restore, lo que borraría todos tus datos. Deberían realizar este servicio gratis. No dejes que te cobren dinero por ello. Este es un problema que Apple causó, y puramente un problema de software. Si los técnicos afirman que hay daño de hardware, están equivocados.

### ¿Qué pasa si tengo macOS 13.6 Ventura y no Sonoma?

macOS 13.6 Ventura usa el Firmware del Sistema de macOS Sonoma, pero sufre del problema. Incluso los usuarios con solo 13.6 instalado de arranque único están afectados por este problema (no se necesita Asahi Linux). No entendemos cómo Apple logró lanzar una actualización del sistema operativo que, cuando se actualiza normalmente, deja las máquinas sin arranque si su tasa de refresco de pantalla no es la predeterminada. Esto parece haber sido un gran descuido de QA por parte de Apple.

Si tu sistema tiene 13.6 Ventura y terminó en la situación de arranque negro, desafortunadamente la única solución conocida es actualizar a Sonoma. Desde el Selector de Arranque, selecciona Opciones. Esto arrancará en recoveryOS. Desde allí, selecciona "Instalar macOS Sonoma". Sigue las indicaciones y selecciona tu volumen de macOS existente. Esto actualizará macOS sin perder tus datos. 