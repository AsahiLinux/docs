---
title: Flujo de Arranque de Apple Silicon
summary:
  Flujo de arranque utilizado por dispositivos Apple Silicon, desde ROM integrada en el SoC hasta código de usuario
---

Los dispositivos Apple Silicon parecen seguir un flujo de arranque muy similar al de los dispositivos iOS modernos.

# Etapa 0 (SecureROM)

Esta etapa se encuentra en la [ROM](../project/glossary.md#r) de arranque. Entre otras cosas, verifica, carga y ejecuta la etapa 1 normal desde [NOR](../project/glossary.md#n). Si esto falla, recurre a [DFU](../project/glossary.md#d) y espera a que se envíe un cargador [iBSS](../project/glossary.md#i), antes de continuar con el flujo [DFU](../project/glossary.md#d) en la etapa 1.

# Flujo normal

## Etapa 1 (LLB/iBoot1)

Esta etapa es el cargador temprano principal, ubicado en la [NOR](../project/glossary.md#n) integrada. Esta etapa de arranque va aproximadamente así:

* Lee la variable `boot-volume` de [NVRAM](../project/glossary.md#n): su formato es `<gpt-partition-type-uuid>:<gpt-partition-uuid>:<volume-group-uuid>`. Otras variables relacionadas parecen ser `update-volume` y `upgrade-boot-volume`, posiblemente seleccionadas por metadatos dentro de la variable `boot-info-payload`;
* Obtiene el hash de política local:
  - Primero intenta el hash propuesto local ([SEP](../project/glossary.md#s) comando 11);
  - Si no está disponible, obtiene el hash bendecido local ([SEP](../project/glossary.md#s) comando 14)
* Lee la política de arranque local, ubicada en la partición iSCPreboot en `/<volume-group-uuid>/LocalPolicy/<policy-hash>.img4`. Esta política de arranque tiene las siguientes claves de metadatos específicas:
  - `vuid`: UUID: UUID del grupo de volumen - igual que arriba
  - `kuid`: UUID: UUID del grupo KEK
  - `lpnh`: SHA384: Hash nonce de política local
  - `rpnh`: SHA384: Hash nonce de política remota
  - `nsih`: SHA384: Hash IMG4 de siguiente etapa
  - `coih`: SHA384: Hash IMG4 de fuOS (kernelcache personalizado)
  - `auxp`: SHA384: Hash de extensiones de kernel autorizadas por usuario auxiliares
  - `auxi`: SHA384: Hash IMG4 de caché de kernel auxiliar
  - `auxr`: SHA384: Hash de recepción de extensión de kernel auxiliar
  - `prot`: SHA384: Hash de manifiesto de recuperación emparejado
  - `lobo`: bool: Política de arranque local
  - `smb0`: bool: Seguridad reducida habilitada
  - `smb1`: bool: Seguridad permisiva habilitada
  - `smb2`: bool: Extensiones de kernel de terceros habilitadas
  - `smb3`: bool: Inscripción manual de gestión de dispositivos móviles (MDM)
  - `smb4`: bool?: Programa de inscripción de dispositivos MDM deshabilitado
  - `sip0`: u16: SIP personalizado
  - `sip1`: bool: Volumen del sistema firmado (`csrutil authenticated-boot`) deshabilitado
  - `sip2`: bool: CTRR ([región de texto configurable de solo lectura](https://keith.github.io/xcode-man-pages/bputil.1.html)) deshabilitado
  - `sip3`: bool: Filtrado de `boot-args` deshabilitado

  Y opcionalmente los siguientes manifiestos vinculados, cada uno ubicado en `/<volume-group-uuid>/LocalPolicy/<policy-hash>.<id>.im4m`
  - `auxk`: Manifiesto AuxKC (kext de terceros)
  - `fuos`: Manifiesto fuOS (kernelcache personalizado)

* Si carga la siguiente etapa:

  - El directorio de arranque se encuentra en el subvolumen Preboot de la partición objetivo, en la ruta `/<volume-uuid>/boot/<local-policy.metadata.nsih>`;
  - Desencripta, verifica y ejecuta `<boot-dir>/usr/standalone/firmware/iBoot.img4` con el árbol de dispositivos y otros archivos de firmware en el mismo directorio. No hay evidencia de otros descriptores de metadatos todavía.

* Si carga una etapa personalizada ([fuOS](../project/glossary.md#f)):

  - ...

Si falla en cualquier punto durante esto, o bien dará error o recurrirá a [DFU](../project/glossary.md#d), esperando a que se envíe un cargador iBEC, antes de continuar con el flujo [DFU](../project/glossary.md#d) en la etapa 2.

## Etapa 2 (iBoot2)

Esta etapa es el cargador a nivel de sistema operativo, ubicado dentro de la partición del sistema operativo y enviado como parte de macOS. Carga el resto del sistema.

# Flujo [DFU](../project/glossary.md#d)

## Etapa 1 (iBSS)

Esta etapa es enviada al dispositivo por el host "revivificador". Inicializa, verifica y ejecuta la segunda etapa, iBEC.

## Etapa 2 (iBEC)

# Modos

Una vez arrancado, el [AP](../project/glossary.md#a) puede estar en uno de varios modos de arranque, como lo confirma el [SEP](../project/glossary.md#s):

|  ID | Nombre                                      |
|----:|-------------------------------------------|
|   0 | macOS                                     |
|   1 | 1TR (recoveryOS "verdadero")              |
|   2 | recoveryOS (recoveryOS "ordinario")       |
|   3 | kcOS                                      |
|   4 | restoreOS                                 |
| 255 | desconocido                               |

El [SEP](../project/glossary.md#s) solo permite la ejecución de ciertos comandos (como editar la política de arranque) en [1TR](../project/glossary.md#1), o fallará con el error 11, "modo de arranque AP". 