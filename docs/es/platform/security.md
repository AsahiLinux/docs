---
title: Seguridad de la Plataforma Apple Silicon
---

## Introducción
La plataforma Apple Silicon ha sido diseñada desde cero para ofrecer a los sistemas correctamente configurados
un entorno operativo extremadamente seguro que es resistente a múltiples formas de ataque. El modelo de seguridad
se basa en el Modelo de Queso Suizo - ningún mecanismo de seguridad individual puede garantizar un nivel aceptable
de seguridad por sí solo, por lo que los mecanismos se superponen para cubrir los huecos de los demás.

Las características de seguridad de la plataforma son orquestadas por el Procesador Secure Enclave (SEP). Una visión general de las características del SEP,
las diferentes políticas de arranque y el selector de arranque en sí está disponible en [Introducción a Apple Silicon](introduction.md).
Esta página en cambio intenta extrapolar y aclarar los conceptos que pueden ser de interés para
usuarios y administradores de sistemas.

A alto nivel, el modelo de seguridad de Apple Silicon en modo Seguridad Completa se compone de seis conceptos clave:

1. La integridad de los datos del sistema y críticos para el arranque está garantizada en todo momento
2. Las políticas de seguridad son configurables por contenedor
3. El hardware y el usuario juntos forman la raíz de confianza para todas las operaciones de seguridad
4. La seguridad y la política de arranque de un contenedor no afectará a ningún otro contenedor
5. Todos los datos están transparentemente encriptados en reposo
6. La desencriptación de datos de usuario puede estar condicionada a la autenticación

Este documento cubre la implementación del modelo de seguridad en un contenedor macOS estándar en modo Seguridad Completa,
y cómo el sistema ha sido diseñado para permitir a un usuario ejecutar código arbitrario (es decir, sistemas operativos de terceros)
sin comprometer las garantías que Apple hace de macOS en modo Seguridad Completa. Este es un punto de venta único
de la plataforma, ya que se aparta del enfoque todo-o-nada del Arranque Seguro de PC de
maneras muy ingeniosas. Es la forma perfecta de ilustrar por qué uno debe ejercer precaución al intentar
hacer equivalencias entre PC y Apple Silicon.

## Tabla de Contenidos
* [Introducción](#introducción)
* [Integridad de datos del sistema](#integridad-de-datos-del-sistema)
* [Políticas de seguridad por contenedor](#políticas-de-seguridad-por-contenedor)
* [La raíz de confianza del usuario](#la-raíz-de-confianza-del-usuario)
* [Recuperación emparejada](#recuperación-emparejada)
* [Encriptación de disco](#encriptación-de-disco)
* [El acuerdo no dicho de Apple](#el-acuerdo-no-dicho-de-apple)
  - [Cómo mantenemos este acuerdo](#cómo-mantenemos-este-acuerdo)

## Integridad de datos del sistema
La plataforma hace grandes esfuerzos para verificar y mantener la integridad de los datos del sistema. Todos los archivos del sistema están,
como mínimo, firmados y hasheados por Apple. Los componentes críticos del firmware, como sepOS (y en versiones anteriores, iBoot) también están encriptados.
El sistema verifica la integridad de todos estos componentes antes de que se les permita ejecutarse. Si alguno de estos
componentes falla la verificación por cualquier razón, el sistema fallará al arrancar y dirigirá al usuario a restaurar
su máquina.

Este modelo se extiende desde el firmware y el cargador de arranque hasta el propio macOS. El SEP mantiene una Política de Arranque
para cada contenedor APFS, que registra un kernelcache de macOS y un volumen de datos del sistema permitido para arrancar.
El kernelcache está firmado por Apple, y su hash está registrado en la Política de Arranque del SEP. Si el hash del kernelcache proporcionado
no coincide con el de la Política de Arranque del SEP o no ha sido firmado por Apple, el sistema
se negará a arrancar ese contenedor APFS.

La instantánea del sistema operativo en sí es una imagen de disco hasheada. Cada archivo dentro de ella también está hasheado, y el árbol Merkle de estos hashes
se utiliza para calcular un hash final conocido como el Sello del Volumen que se utiliza para firmar el volumen. Si el hash
de la imagen en sí o el sello no coincide con la Política de Arranque del SEP, entonces el sistema no arrancará.
Los datos de usuario mutables se almacenan en un volumen completamente diferente en el contenedor, y se unen con la instantánea para
ser presentados como un único sistema de archivos al usuario solo después de que la instantánea haya sido verificada. Ningún archivo puede intersectar la
instantánea del sistema operativo y el volumen de datos de usuario, y es imposible mutar la instantánea en modo Seguridad Completa. Esta
característica se conoce como Volumen del Sistema Sellado (SSV).

Un kernelcache registrado tampoco puede ser utilizado para pivotar a una raíz no confiable. Un kernelcache solo puede ser utilizado
para montar y arrancar la instantánea del sistema operativo para la que está registrado en la Política de Arranque. El SEP detendrá el arranque
si un kernelcache está intentando montar una instantánea del sistema operativo que no está autorizado a montar. Esto previene la
captura de todo el sistema desde un contenedor comprometido.

## Políticas de seguridad por contenedor
Apple sabe que este nivel de bloqueo no es adecuado en todos los casos para todos los usuarios. ¿Qué pasa si alguien quiere
desarrollar y probar una extensión del kernel, por ejemplo? En Macs Intel, la manipulación de los archivos del sistema podía
lograrse deshabilitando la Protección de Integridad del Sistema. En Apple Silicon, Apple ha tomado un enfoque más granular,
con el SEP capaz de rastrear políticas de seguridad a nivel de contenedor. Esto permite a los usuarios mantener una
instalación de macOS completamente segura mientras también experimentan con un entorno más permisivo.

Apple ha declarado públicamente que la intención de esta característica es permitir la instalación de sistemas operativos de terceros sin
que Apple tenga que comprometer sus garantías de seguridad para macOS, e incluso han declarado que
darían la bienvenida a Microsoft portando Windows a la plataforma.

Un contenedor APFS reconocido como un sistema macOS válido (ciertas estructuras del sistema de archivos deben estar presentes) puede
ser colocado en modo Seguridad Permisiva. Esto a menudo se presenta como permitir a los usuarios "ejecutar" código arbitrario,
sin embargo hay algunos matices aquí. Lo que _realmente_ se está permitiendo es el registro de kernelcaches de macOS
que no están firmados por Apple en una Política de Arranque para el contenedor, y la deshabilitación de SSV. El usuario
proporciona un kernelcache al SEP que lo hashea, lo firma y crea una Política de Arranque para el contenedor.

Otras garantías de integridad del sistema aún se aplican a los contenedores en Modo Permisivo. El sistema aún se negará
a arrancar si el firmware o el cargador de arranque han sido comprometidos, igualmente si el kernelcache proporcionado por el usuario es
manipulado después de ser registrado en el SEP. La instantánea recoveryOS emparejada también debe seguir estando firmada por Apple
por razones que veremos pronto. Si el usuario desea cambiar el kernelcache nuevamente después de registrarlo, debe
registrar otro. Esto asegura a la plataforma que confías en el binario.

Pero, ¿qué pasa si un actor malicioso entra en tu contenedor de Seguridad Permisiva? ¿No podrían registrar un
nuevo kernelcache y capturar silenciosamente el contenedor sin que te des cuenta? Como era de esperar, Apple pensó en esto
y tiene una forma muy simple de mitigar este vector de ataque.

## La raíz de confianza del usuario
Si bien el SEP es la raíz de confianza de hardware para operaciones criptográficas, de hecho hay otro componente
que forma una raíz de confianza para operaciones que alteran la seguridad de un contenedor o la configuración de arranque. Tú.

La interacción del usuario con el SEP forma la raíz de confianza última para el modelo de seguridad de la plataforma.
Durante la configuración inicial de una máquina Apple Silicon, el SEP registra un conjunto de credenciales de "Propietario de la Máquina",
que son las credenciales de la primera cuenta macOS configurada en la máquina en un contenedor de Seguridad Completa.
Este conjunto de credenciales de Propietario de la Máquina se utiliza para autenticar y firmar cualquier operación que altere el estado
de la seguridad de un contenedor o la política de arranque. Esto por sí solo no crea una raíz de confianza de hardware "verdadera" a partir del
usuario, ya que alguien _podría_ capturar las credenciales del Propietario de la Máquina, pero el SEP es lo suficientemente inteligente como para
hacer una verificación más para asegurarse de que el Propietario de la Máquina es quien dice ser.

Las máquinas Apple Silicon pueden ser arrancadas en varios estados, que son controlados por el SEP e iBoot. Uno de estos
estados, 1TR, solo puede ser entrado desde un arranque en frío manteniendo presionado el botón físico de encendido, y autenticando
con las credenciales del Propietario de la Máquina. Si el SEP no está satisfecho de que _ambas_ estas condiciones se hayan cumplido intencionalmente
(por ejemplo, el botón de encendido se suelta prematuramente), entonces no registrará un arranque 1TR. Las operaciones de seguridad
como degradar un contenedor a Seguridad Permisiva **solo** pueden hacerse desde 1TR. El SEP simplemente se negará
a completar la transacción si no está satisfecho de que la solicitud se originó en un entorno 1TR válido.
Algunas operaciones, como instalar un objeto de arranque personalizado, requieren que las credenciales del Propietario de la Máquina se ingresen
una segunda vez.

Esto permite al SEP formar una raíz de confianza de hardware a partir del propio usuario con la que firmar transacciones de política de seguridad,
garantizándose a sí mismo que el propietario de la máquina confía explícitamente en la operación que se está solicitando.
Esto es suficiente para mitigar la mayoría de las clases de ataque que podrían comprometer el proceso de arranque en cualquier contenedor,
ya sea ejecutado local o remotamente.

## Recuperación emparejada
Este es muy simple. A partir de macOS 12, arrancar en 1TR te lleva a la instantánea de recuperación emparejada
del contenedor APFS bendecido. El SEP solo te permitirá hacer cambios al contenedor bendecido,
lo que ayuda a limitar la propagación del daño si un contenedor está de alguna manera comprometido hasta el punto donde un actor
malicioso ha logrado de alguna manera eludir tanto la presencia física como las verificaciones del Propietario de la Máquina.

## Encriptación de disco
Desde la introducción del T2, los Macs han tenido una encriptación por volumen bastante robusta y transparente. Es por esta razón
que Apple no puede reemplazar SSDs defectuosos en Macs post-T2 sin pérdida total de datos. El estado predeterminado para este sistema
es datos encriptados en reposo - la máquina desencriptará transparentemente los datos en tránsito con sus propias claves, mientras permanecen
encriptados en el disco. Casi no hay penalización de rendimiento por esto. En máquinas Apple Silicon, el SEP
genera una Clave de Encriptación de Volumen (VEK) y un Token Anti-Reproducción Extendido (xART) para cada volumen APFS. El xART previene
ataques de reproducción de capturar la VEK, que se almacena en la propia memoria aislada del SEP y nunca puede ser leída por
los núcleos de aplicación para endurecerla aún más contra la captura.

Los datos en el volumen se encriptan/desencriptan en tránsito. sepOS pasa las claves directamente al controlador NVMe,
evitando los núcleos de aplicación para endurecer contra la captura de claves. Es importante ser consciente de que una vez que la máquina
se ha encendido y el SEP está satisfecho con el estado de iBoot y el firmware del sistema, las claves se desenvuelven y
**todos los datos son accesibles** en claro a través de todas las particiones. Aquí es donde entra FileVault para macOS.

Cuando FileVault está habilitado para un volumen APFS, la VEK y xART se envuelven con una Clave de Encriptación de Clave (KEK), que está respaldada
por credenciales de usuario del contenedor macOS en cuestión. La máquina no podrá leer el volumen de datos de usuario del
contenedor protegido hasta que estas credenciales se proporcionen al inicio. Habilitar esto es instantáneo en máquinas Apple Silicon, ya que
la única operación requerida es generar la KEK y una clave de recuperación. La instantánea del sistema, Preboot, y
los volúmenes de recuperación no están protegidos por FileVault. Estas particiones son inmutables, respaldadas por el SEP, y no contienen datos de usuario
y por lo tanto no se benefician particularmente de FileVault. Todas las claves de encriptación son destruidas por el SEP
cuando el Propietario de la Máquina solicita que la máquina sea borrada, garantizando que cualquier dato residual sea indescifrable incluso para programas
de recuperación de datos.

Podemos emular esto muy bien con LUKS sobre LVM y lograr una encriptación de disco completa efectiva. Tenemos el lujo de ignorar el
stub APFS ya que las únicas cosas que nos importan allí son m1n1 y recoveryOS, ambos verificados, firmados y a prueba de manipulación.
Una debilidad existente es que `/boot` debe almacenarse en claro, y actualmente no hay
un análogo de Arranque Seguro o Arranque Medido con el que podamos garantizar la integridad del kernel o initramfs. Los usuarios pueden elegir
apuntar su cargador de arranque a medios removibles una vez que esto esté mejor soportado para mitigar esto. Más allá de eso, cualquier cargador de arranque que soporte LUKS
y LVM funcionará con un flujo de trabajo estándar de `cryptsetup` una vez que el usuario haya configurado sus particiones a su gusto.

## El acuerdo no dicho de Apple
Al documentar el modelo de seguridad, Apple usa el ejemplo de un desarrollador de kernel XNU que desea probar
sus cambios en una segunda instalación de macOS. Sin embargo, es evidente que el modelo de seguridad de la plataforma
fue diseñado para permitir que sistemas operativos de terceros coexistan con macOS de una manera que
no compromete ninguna de las garantías de seguridad de Apple para el propio macOS. Los rumores que circulan de que Apple
es activamente hostil hacia esfuerzos como Asahi, o que su seguridad debe ser eludida o jailbroken para ejecutar
código no confiable son infundados y falsos. De hecho, Apple ha gastado esfuerzo y tiempo en _mejorar_ sus
herramientas de seguridad de maneras que _solo_ mejoran la ejecución de binarios no-macOS. Un ejemplo de esto es
dar a su herramienta de configuración de Política de Arranque la capacidad de envolver código AArch64 crudo en un formato Mach-O apropiado
a partir de macOS 12.1. Esto solo se requiere para registrar un objeto de arranque que no es ya
un kernelcache de macOS.

Dicho esto, un acuerdo necesariamente corta en ambos sentidos. Dado que los Macs Apple Silicon son esencialmente iDevices ampliados,
Apple se esforzó por alterar ese modelo de seguridad para ser más flexible y no es difícil
inferir por qué. En algún nivel en la empresa, alguien habría sido muy consciente de que un proyecto como Asahi sería
inevitable, ya sea con su consentimiento o no. En lugar de arriesgar que la comunidad de jailbreaking
avergüence sus garantías de marketing de privacidad y seguridad intentando hacer que se ejecute código arbitrario,
nos han dado las herramientas para hacerlo fácilmente sin necesidad de tocar su sandbox. Por lo tanto, tomamos esta
funcionalidad como viniendo con una simple condición - no, bajo ninguna circunstancia, intentes envenenar el
contenedor de macOS.

### Cómo mantenemos este acuerdo
Asahi Linux crea un pequeño contenedor APFS y conjunto de volúmenes con la estructura de archivos correcta para ser reconocido como un sistema operativo válido,
luego usa las herramientas de Apple para establecer su seguridad a Permisiva y registrar m1n1 como su objeto de arranque firmado. No
alteramos - y nunca alteraremos - la configuración de seguridad de _ningún otro_ volumen del sistema operativo, ni las políticas de seguridad
de Apple para esos contenedores afectarán al volumen de Asahi. Más detalles se pueden encontrar en [Ecosistema de Sistemas Operativos Abiertos en Macs Apple Silicon](open-os-interop.md). 