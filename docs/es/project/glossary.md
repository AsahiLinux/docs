---
title: Glosario
---

Términos útiles para conocer.

Agregue términos específicos del hardware, ingeniería inversa y ecosistemas de Apple que sean relevantes. No agregue cosas que se espera que todos conozcan (CPU, GPU, HDD, SSD, OSX, USB, HDMI, RAM, etc.) o que no sean relevantes para el proyecto. Piense en la audiencia objetivo como "desarrollador aleatorio de Linux".

Si desea recopilar un gran conjunto de términos específicos de un subcampo (como GPUs), no dude en crear una página separada.

### 1
* **1TR**: One True RecoveryOS. Es como se llama RecoveryOS cuando lo inicias manteniendo presionado el botón de encendido. Esto significa que has asegurado presencia física y estás ejecutando un entorno de recuperación completamente confiable de Apple, lo que te da poderes especiales, como la capacidad de instalar un sistema operativo personalizado. Obtienes acceso root, pero solo puedes ejecutar software firmado por Apple, y si FileVault está habilitado, primero necesitas autenticarte.

### A
* **AGX**: El nombre interno para la serie de GPU de Apple.
* **AIC**: Apple Interrupt Controller. El controlador de interrupciones ARM personalizado de Apple, porque el GIC estándar era demasiado estándar para Apple.
* **AMX**: Apple Matrix eXtensions. Un coprocesador de matrices parcialmente integrado en el ISA.
* **ANE**: Apple Neural Engine. Unidad de multiplicación-suma FP16.
* **ANS**: ¿Coprocesador NVME/almacenamiento?
* **AOP**: Always On Processor. Coprocesador/DSP del SoC de Apple que permite la función "Hey Siri" en macOS entre otras cosas.
* **AP**: Application Processor. La CPU principal que ejecuta la mayor parte del sistema operativo. Contraste con SEP.
* **APFS**: Apple File System. El nuevo sistema de archivos "moderno" orientado a contenedores y volúmenes de Apple, similar a ZFS y btrfs.
* **APFS Container**: una partición física en un disco que puede contener múltiples sistemas de archivos (volúmenes), todos compartiendo espacio dinámicamente.
* **APFS Snapshot**: una instantánea de solo lectura de copia al escribir de un volumen APFS.
* **APFS Volume**: un sistema de archivos lógico dentro de un contenedor APFS, que puede montarse en un directorio.
* **APR**: APR ProRes. Maneja la codificación y decodificación de video ProRes.
* **APSC**: Automatic Power State Controller.
* **ASC**: ¿Posible nombre genérico para Coprocesadores? ej. gfx-asc. Posiblemente Apple Silicon Coprocessor.
* **AVD**: Apple Video Decoder.
* **AVE**: Apple Video Encoder. Soporta AVC y HEVC.

### B
* **BootROM**: Una memoria de solo lectura integrada en un chip como el M1, que es el primer código ejecutado al iniciar. Ver SecureROM.

### C
* **Chicken Bits**: También conocidos como "kill bits", bits de configuración utilizados para deshabilitar/habilitar características específicas.

### D
* **DART**: Device Address Resolution Table. IOMMU personalizado de Apple.
* **DCP**: Display Control Processor (probablemente). Permite el soporte para mostrar nuevos frames sin desgarros, sprites de hardware ej. cursor del mouse, cambiar resoluciones, configurar múltiples salidas, y más.
* **DFR**: Dynamic Function Row. Nombre interno de Apple para la Touch Bar.
* **DFU**: Device Firmware Update. Un modo USB que permite flashear el firmware de un dispositivo a través de USB. Los dispositivos Apple soportan esto en el SecureROM, para permitir al usuario restaurar dispositivos que de otra manera estarían bloqueados.
* **DPE**: Digital Power Estimator.
* **DVFM**: Dynamic Voltage and Frequency Management.

### E
* **EEPROM**: Electrically Erasable Programmable Read Only Memory. Un tipo de memoria reescribible, comúnmente disponible en tamaños de unos pocos kilobytes como máximo, más robusta que NOR Flash. A menudo se usa para configuraciones y código de inicio muy temprano.

### F
* **Fallback Recovery OS**: 2da copia del sistema de recuperación accesible haciendo doble clic y manteniendo presionado el botón de encendido para iniciar. A diferencia de 1TR no puede cambiar el estado de seguridad (configuraciones). Se puede distinguir de Recovery OS 1TR por la falta de la opción "Start Security Utility" en Utilidades
* **fuOS**: Sistema operativo personalizado, se especula que significa "fully untrusted OS".

### G
* **GPT**: GUID Partition Table: Un formato de tabla de particiones creado para EFI/UEFI y ahora usado en la mayoría de los sistemas modernos.
* **GXF**: probablemente Guarded Execution Function. Niveles de excepción laterales utilizados para crear un hipervisor de bajo overhead para proteger las tablas de páginas y estructuras igualmente importantes del propio XNU. Ver por ejemplo [el artículo de Sven](https://blog.svenpeter.dev/posts/m1_sprr_gxf/) o [SPRR y GXF](../hw/cpu/sprr-gxf.md)

### H
* **HFS+**: Hierarchical Filesystem+: Sistema de archivos anterior de Apple, usado para almacenamiento externo. No se usa para almacenamiento interno en Macs M1.

### I
* **I²C**: Inter-Integrated Circuit. Un estándar de 2 hilos para comunicarse a baja velocidad entre chips en una placa.
* **iBEC**: iBoot Epoch Change. Reemplazo para el iBoot de segunda etapa, cargado en el flujo de inicio DFU.
* **iBoot**: El cargador de inicio de Apple. Puede referirse a iBoot1, iBoot2, o cualquiera de iBSS, iBEC, o incluso el propio SecureROM (que son todas diferentes compilaciones de iBoot con diferentes capacidades).
* **iBoot1**: El iBoot de primera etapa ubicado en NOR, cargado por el SecureROM. Encadena el iBoot de segunda etapa (iBoot2) en la partición OS Preboot, después de hacer la inicialización temprana y cargar firmwares independientes del sistema operativo. LLB es un nombre más antiguo para iBoot1.
* **iBoot2**: El iBoot de segunda etapa ubicado en la partición OS Preboot. Esta versión de iBoot es específica para cada sistema operativo instalado, y viene empaquetada con el conjunto de firmwares en tiempo de ejecución que el sistema operativo necesita para ejecutarse.
* **iBSS**: iBoot Single Stage. Reemplazo para el iBoot de primera etapa (iBoot1/LLB), cargado en el flujo de inicio DFU cuando el NOR está corrupto.
* **IOKit**: I/O Kit es el framework de controladores de dispositivos de Apple para XNU (el kernel del sistema operativo de Apple).
* **IOMMU**: I/O Memory Management Unit, un término más general para el DART de Apple.
* **IPI**: Inter-processor interrupt. Una interrupción utilizada por un procesador para interrumpir a otro.
* **iSC**: iBoot System Container. Una partición de disco (generalmente la primera en el SSD interno) que contiene los datos de inicio del sistema. (Ver [Disposición de Particiones Stock](../platform/stock-partition-layout.md))
* **ISP**: Image Signal Processor. Webcam en laptops de la serie M. Denota toda la unidad de cámara, desde los sensores hasta el flash y el coprocesador.

### J
* **JTAG**: Joint Test Action Group. En realidad se refiere a una interfaz de depuración lanzada por ese grupo, una interfaz de 4/5 hilos para depurar chips y CPUs a nivel de hardware.

### K
* **kASLR**: kernel Address Space Location Randomization: Característica del kernel de Linux que aleatoriza dónde se coloca el código del kernel en memoria al iniciar. Deshabilitada especificando la bandera de inicio `nokaslr`.
* **kcOS**: Sistema operativo con una caché de kernel personalizada.
* **Kernel cache**: Un paquete del kernel y sus extensiones, opcionalmente encriptado.
* **kmutil**: Utilidad de gestión de kernel de macOS para gestionar extensiones de kernel (kexts). Usada para iniciar kernels alternativos ej. m1n1

### L
* **LLB**: Low Level Bootloader, un nombre más antiguo para iBoot1 heredado de plataformas iOS.

### M
* **Mini**: Cargador de inicio personalizado para investigación interna. Puede o no soportar el inicio desde SSD. Este proyecto usa un fork que se conoce como M1N1.
* **Mux**: Multiplexor, un dispositivo que puede conectar una de varias cosas a una sola conexión, como cambiar un conjunto de pines entre modos USB, UART y SWD.

### N
* **NAND**: Not-AND. Un tipo de puerta lógica, pero normalmente se refiere a un tipo de memoria Flash, que es la que se usa en todo el almacenamiento Flash moderno de alta capacidad como tarjetas SD y SSDs, pero también viene en chips desnudos.
* **NOR**: Not-OR. Un tipo de puerta lógica, pero normalmente se refiere a un tipo de memoria Flash, que solo se usa para aplicaciones de baja capacidad (hasta unos pocos megabytes como máximo). Más robusta que NAND. Generalmente viene en chips desnudos de 8 pines estos días.
* **NVRAM**: Non-Volatile RAM. El nombre es obsoleto, solo significa una lista de parámetros clave=valor almacenados en una Mac para la configuración de inicio. Similar a variables UEFI.

### P
* **PMGR**: Power manager.
* **PMP**: Power Management Processor.

### R
* **RecoveryOS**: El entorno de recuperación, que puede ser una imagen de recuperación emparejada con una instalación del sistema operativo (ubicada dentro de un subvolumen APFS) o la imagen de recuperación global instalada en el último contenedor APFS del disco. macOS 11.x usa la imagen global por defecto, mientras que macOS 12.0 y más nuevo usa un recoveryOS emparejado.
* **RestoreOS**: El entorno de restauración, cargado en el dispositivo cuando se "revive" a través del modo DFU por Apple Configurator. [más información](https://www.theiphonewiki.com/wiki/Restore_Ramdisk)
* **ROM**: es un acrónimo de Read-Only Memory. Se refiere a chips de memoria de computadora que contienen datos permanentes o semipermanentes.
* **RTKit**: Sistema operativo en tiempo real propietario de Apple. La mayoría de los aceleradores (AGX, ANE, AOP, DCP, AVE, PMP) ejecutan RTKit en un procesador interno. La cadena "RTKSTACKRTKSTACK" es característica de un firmware que contiene RTKit.
* **RTOS**: Sistema operativo en tiempo real.

### S
* **SBU**: Sideband Use. Dos pines en conectores Type C libres para ser usados para cosas aleatorias, no definidas por el estándar Type C en sí.
* **SecureROM**: El BootROM del M1. Este es responsable de leer iBoot1 desde NOR y pasarle el control, o caer en modo DFU.
* **SEP**: Secure Enclave Processor. El dispositivo HSM/TPM/etc integrado del M1. Maneja Touch ID y la mayoría del cifrado, así como decisiones de política de inicio. Inofensivo para Linux, pero podemos usar sus características si queremos. Contraste con AP.
* **SFR**: System Firmware and Recovery, la colección de firmware y la imagen de recuperación compartida por todos los sistemas operativos instalados en el sistema, incluyendo componentes en NOR (como iBoot1), el iBoot System Container, la partición System Recovery, y memorias Flash externas y otras ubicaciones misceláneas. SFR siempre avanza en versión, nunca retrocede (excepto mediante un borrado completo).
* **SIP**: System Integrity Protection. También llamado "rootless", donde el kernel de macOS impide que incluso root haga algunas cosas.
* **SMC**: System Management Controller: una pieza de hardware que maneja el acceso a cosas como sensores de temperatura, medidores de voltaje/potencia, estado de la batería, estado del ventilador, y la retroiluminación LCD y el interruptor de la tapa. Ver [SMC](../hw/soc/smc.md)
* **SOP**: Start Of Packet. Usado para diferenciar tipos de paquetes en USB-PD. SOP para comunicaciones normales, SOP' y SOP" para hablar con chips integrados en un cable, SOP'DEBUG y SOP"DEBUG para cosas específicas del vendedor personalizadas como VDMs de Apple.
* **SPI**: Serial Peripheral Interface. Un estándar de 4 hilos para comunicarse a baja velocidad entre chips en una placa.
* **SPMI**: System Power Management Interface de MIPI Alliance: interfaz bidireccional de 2 hilos, Multi master(hasta 4), Multi slave(hasta 16), 32KHz a 26MHz. Ver [System Power Management Interface](https://en.wikipedia.org/wiki/System_Power_Management_Interface)
* **SPRR**: probablemente Shadow Permission Remap Registers. Convierte los atributos normales de permisos de página (AP,PXN,UXN) en un índice a una tabla separada. Esta nueva tabla luego determina los permisos reales de página. También prohíbe páginas que son escribibles y ejecutables al mismo tiempo. Ver por ejemplo [el artículo de Sven](https://blog.svenpeter.dev/posts/m1_sprr_gxf/) o [SPRR y GXF](../hw/cpu/sprr-gxf.md)
* **SWD**: Serial Wire Debug. Una interfaz de 2 pines usada para depurar núcleos ARM, como JTAG sobre menos pines. Usada en dispositivos Apple, pero inaccesible (para la CPU/SoC principal) en dispositivos de producción debido a restricciones de seguridad.

### T
* **TBT**: Thunderbolt Technology

### U
* **UART**: Universal Asynchronous Receiver Transmitter. El hardware detrás de un puerto serie.
* **USB-PD**: USB Power Delivery. Un estándar para comunicaciones secundarias sobre USB Type C (no hablaremos del estándar más antiguo por nuestra propia cordura). Esto se usa para cosas como detectar qué tipo de cable se usa, orientación del conector, configurar el voltaje de suministro, y cambiar a modos no USB.
* **USC**: Unified shader core. Un núcleo shader que soporta todos los tipos de shader (vértice, fragmento, computación). AGX es una arquitectura unificada, así que esto solo se refiere a un núcleo shader.

### V
* **VBUS**: Pin USB que entrega energía. Por defecto 5V, puede llegar hasta 20V con USB-PD.
* **VDM**: Vendor Defined Message. Usado tanto para USB Alternate Mode (no realmente propietario) como para comandos propietarios del vendedor sobre USB-PD. Apple usa estos para configurar modos especiales en sus puertos Type C.
* **VHE**: Virtual Host Extensions. Registros adicionales para permitir un cambio más eficiente entre OS/VMs/Espacio de usuario. Ver [explicación ARM VHE](https://developer.arm.com/documentation/102142/0100/Virtualization-Host-Extensions)

### X
* **XNU**: El kernel del sistema operativo de Apple para macOS, iOS, iPadOS, watchOS, tvOS y así sucesivamente. "XNU" es una abreviatura de "X is not Unix" 