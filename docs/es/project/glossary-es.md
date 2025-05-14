---
title: Glosario Técnico en Español
---

Este glosario proporciona definiciones de términos técnicos comunes utilizados en la documentación de Asahi Linux, junto con sus equivalentes en español cuando están disponibles.

## Términos Generales

### Arranque y Sistema
- **Arranque (Boot)**: Proceso de inicialización del sistema
- **Firmware**: Software de bajo nivel que controla el hardware
- **Kernel**: Núcleo del sistema operativo
- **Sistema Operativo (OS)**: Software que gestiona los recursos del hardware
- **Partición**: División lógica del almacenamiento
- **Volumen**: Unidad de almacenamiento lógica en APFS

### Hardware
- **SoC (Sistema en un Chip)**: Circuito integrado que contiene todos los componentes principales
- **CPU (Unidad Central de Procesamiento)**: Procesador principal
- **GPU (Unidad de Procesamiento Gráfico)**: Procesador gráfico
- **RAM (Memoria de Acceso Aleatorio)**: Memoria principal del sistema
- **ROM (Memoria de Solo Lectura)**: Memoria no volátil
- **UART (Transmisor-Receptor Asíncrono Universal)**: Interfaz de comunicación serie
- **USB-PD (USB Power Delivery)**: Protocolo de suministro de energía USB

## Apple Silicon Específico

### Componentes
- **AGX**: GPU personalizada de Apple
- **SEP (Secure Enclave Processor)**: Procesador seguro para operaciones criptográficas
- **SecureROM**: ROM de arranque seguro
- **iBoot**: Cargador de arranque de Apple
- **XNU**: Kernel de macOS

### Sistemas de Archivos
- **APFS (Apple File System)**: Sistema de archivos moderno de Apple
  - **Contenedor APFS**: Similar a un pool ZFS
  - **Volumen APFS**: Similar a un dataset ZFS
  - **Instantánea APFS**: Similar a un snapshot ZFS

### Arranque
- **1TR (One True Recovery)**: Entorno de recuperación del sistema
- **iSC (iBoot System Container)**: Contenedor APFS con configuraciones de arranque
- **Boot Policy**: Política de arranque del sistema
- **AP Ticket**: Blob firmado para validación de macOS

## Desarrollo

### Herramientas
- **m1n1**: Hipervisor y herramienta de desarrollo
- **U-Boot**: Cargador de arranque universal
- **DT (Device Tree)**: Árbol de dispositivos
- **ADT (Apple Device Tree)**: Árbol de dispositivos de Apple

### Términos de Desarrollo
- **Kext (Kernel Extension)**: Extensión del kernel
- **Kernelcache**: Kernel + blob de kexts
- **DFU (Device Firmware Update)**: Modo de actualización de firmware
- **SIP (System Integrity Protection)**: Protección de integridad del sistema

## Seguridad

### Modos de Seguridad
- **Full Security**: Seguridad completa
- **Reduced Security**: Seguridad reducida
- **Permissive Security**: Seguridad permisiva

### Componentes de Seguridad
- **SEP (Secure Enclave)**: Enclave seguro
- **SecureROM**: ROM de arranque seguro
- **AP Ticket**: Ticket de autenticación de Apple

## Notas de Uso

1. **Términos sin Traducción**: Algunos términos técnicos se mantienen en inglés cuando no existe una traducción comúnmente aceptada o cuando la traducción podría causar confusión.

2. **Consistencia**: Se mantienen los términos en inglés cuando:
   - Son acrónimos (CPU, GPU, RAM)
   - Son nombres de productos específicos (APFS, XNU)
   - No tienen una traducción estándar en la comunidad

3. **Formato**: 
   - Los términos en inglés se muestran en **negrita**
   - Las traducciones al español se muestran entre paréntesis cuando son diferentes
   - Los acrónimos se mantienen en mayúsculas

4. **Actualización**: Este glosario se actualizará a medida que se agreguen nuevos términos o se establezcan traducciones estándar en la comunidad.

## Referencias

- [Glosario en Inglés](../project/glossary.md)
- [Documentación de Apple](https://developer.apple.com)
- [Documentación de Linux](https://www.kernel.org/doc/html/latest/) 