---
title: Diferencias en el flujo de arranque respecto a la plataforma AMD64 PC
---

Las máquinas M1 utilizan un proceso de arranque que superficialmente parece muy diferente de cómo arranca una PC regular o una Mac Intel más antigua. Sin embargo, hay lógica en esta locura. Este documento le proporciona una forma de pensar que puede usar para visualizar mejor cómo funcionan las cosas en las máquinas Apple Silicon.

# SSD

El SSD en las máquinas M1 contiene tanto componentes de arranque como el sistema operativo que está instalado en la máquina. Esto es diferente de las máquinas UEFI. Piense en el SSD de Apple Silicon como siendo *tanto* partes de la memoria flash del firmware UEFI (en particular, la configuración se almacena en el SSD), *como* el dispositivo NVMe principal del sistema operativo desde el que arranca, incluyendo el cargador del sistema operativo, combinados. Si está familiarizado con dispositivos Android, estos utilizan un modelo similar.

El SSD usa GPT, al igual que los discos bajo la mayoría de los sistemas UEFI. La primera partición se usa para cosas relacionadas con el arranque, configuración y a veces firmware, algo así como el volumen de firmware de variables UEFI y otros bits. El sistema operativo se instala en un contenedor que incluye un volumen que contiene el cargador de arranque del sistema operativo, algo de firmware y el kernel del sistema operativo. Piense en esto como similar a la Partición del Sistema EFI (ESP).

iBoot solo puede entender APFS, y las tres particiones en el disco GPT son contenedores APFS que contienen múltiples volúmenes APFS.

# Flash NOR

También hay un chip flash separado, llamado flash NOR. Este es el mismo tipo de chip que contiene el firmware UEFI en PCs. Solo contiene información del producto y la primera etapa de iBoot. Puede pensarlo como la parte temprana del firmware UEFI, suficiente para arrancar el cargador del sistema operativo desde el almacenamiento interno pero *sin* incluir una gran cantidad de controladores como lo hace UEFI.

# SecureROM

Este es un ROM integrado en el M1 y es verdaderamente el primer código que se ejecuta. Su trabajo es cargar la primera etapa de iBoot desde NOR y ejecutarla.

Los PCs Intel/AMD también tienen varios ROMs y un proceso de arranque complicado, pero nunca escuchamos sobre esas partes porque son propietarias. La idea de que los PCs Intel modernos comienzan directamente a ejecutar código desde el firmware en Flash sin ninguna inicialización es una ilusión, pero nos gusta pretender que así es como funciona.

# iBoot

iBoot es el cargador de arranque principal en las máquinas M1. Es pequeño. No puede entender almacenamiento externo. No soporta USB. No tiene una interfaz de usuario. Todo lo que puede hacer es arrancar desde almacenamiento interno, y mostrar un logo de Apple y algunos mensajes de error.

iBoot es como los componentes de nivel inferior del firmware UEFI en una PC. Suficiente para arrancar desde NVMe interno, pero sin ningún controlador USB.

Hay dos etapas en iBoot. Una de ellas vive en Flash NOR, y su trabajo es entender APFS y cargar la segunda etapa desde el SSD. Esto es como el firmware del sistema, y es persistente. La segunda etapa es efectivamente un cargador de arranque de macOS, y arranca el kernel de macOS. Esto es como boot.efi en Macs Intel.

# Modo Recuperación

El Modo Recuperación es una instancia de macOS que está integrada en una partición separada. Es un entorno seguro donde puede seleccionar qué sistema operativo arrancar, o entrar en un shell/entorno de recuperación. Cuando mantiene presionado el botón de encendido en una máquina Apple Silicon, en realidad está arrancando macOS. La pantalla de opciones de arranque ya es una aplicación macOS de pantalla completa. Una vez que entra en modo recuperación, puede abrir una terminal y obtiene un shell root. Puede usar la red, curl, sh, perl y otras herramientas que vienen con la instalación. Puede ejecutar scripts arbitrarios y el entorno tiene comandos útiles para configurar el arranque. Puede ejecutar sus propios binarios firmados ad-hoc (a partir de 11.2). Sin embargo, se aplican las restricciones de SIP y AMFI (derechos), por lo que no puede otorgar a sus propios binarios, por ejemplo, permiso para interactuar con la política de arranque/SEP.

El modo recuperación es como un shell UEFI potenciado y un menú de configuración UEFI combinados en uno. Debería ser lo suficientemente potente para que podamos construir un instalador de Linux a partir de él. Piense en él como el resto del firmware UEFI, y más.

# macOS

macOS arranca desde la segunda partición GPT. Es el sistema operativo real. Comienza con el kernel Darwin y continúa desde allí.

Asahi Linux reemplaza o complementa a macOS. Este punto es donde se nos permite reemplazar cosas y arrancar nuestro propio código.

El concepto de un "sistema operativo" para Macs Apple Silicon incluye tanto el cargador del sistema operativo (la segunda etapa de iBoot) como el kernel Darwin y el sistema de archivos. Podemos reemplazar el kernel, pero no la segunda etapa de iBoot - el kernel es el punto en el proceso de arranque donde Apple ha desarrollado la capacidad de degradar la seguridad y ejecutar nuestro propio código. También necesitamos mantener la estructura general parecida a macOS. Esto significa que, efectivamente, Linux se iniciará desde una "cáscara" de macOS, un volumen con solo iBoot y algunos archivos para convencer a la infraestructura de arranque de Apple de que es un sistema operativo legítimo que puede ser arrancado. Piense en todo esto como una Partición del Sistema EFI algo complicada.

Dado que hay requisitos especiales sobre cómo se instala la primera etapa de arranque que reemplaza a macOS, es inconveniente actualizar desde Linux. Por lo tanto, lo que haremos es insertar nuestra propia cadena de cargadores de arranque en este punto. Puede pensar en esto como el "shim" de arranque seguro UEFI usado para instalar Linux en entornos UEFI que usan las claves de arranque seguro de Microsoft. La firma es diferente; no necesitaremos ni usaremos ningún certificado de desarrollador de Apple para esto; en su lugar, lo que sucederá es que el proceso de instalación "firmará" la primera etapa para uso en una sola máquina - pero el concepto es similar. Después de esta etapa, podemos encadenar el arranque a cualquier cosa que queramos desde sistemas de archivos más estándar en el mundo Linux, como ext4 o FAT32.

# DFU

DFU es un modo de recuperación integrado en el SecureROM del M1 que permite flashear el dispositivo desde cero, si iBoot y/o el modo recuperación están ausentes. DFU funciona incluso si los datos en el Flash NOR están ausentes.

DFU no existe en la mayoría de las PCs. Si el flash UEFI está corrupto, la PC está bloqueada. El modo DFU es una característica única de los dispositivos Apple Silicon.

Algunas placas base de PC implementan una característica similar como parte de un chip separado, que puede flashear el firmware UEFI desde una memoria USB sin encender realmente la placa base normalmente, pero esto solo es común en placas base independientes de gama alta.

Gracias al modo DFU, es prácticamente imposible bloquear una máquina Apple Silicon de una manera que no pueda ser recuperada externamente. El peor escenario es que la información del producto (número de serie, calibración, etc.) en NOR se borre. Si eso sucede, en teoría, el proceso DFU debería obtener esa información de Apple durante los pasos de recuperación de contacto con el servidor. Incluso entonces, que esto suceda por accidente es extremadamente improbable. 