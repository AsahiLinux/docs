---
title: Controladores de Pantalla
---

La serie M de chips tiene dos tipos de controladores de pantalla, `dcp` y `dcpext`. Ambos tipos soportan:
- DP 1.4 (4 carriles) con DSC. ¡Sin MST!
- HDMI a través de convertidor dp2hdmi. Ver abajo para restricciones de enrutamiento.
- Puertos USB-C: modo alternativo DP, o túnel USB4 con máximo 2 controladores por puerto. Ver abajo para restricciones de enrutamiento.

Información específica del controlador:

| Tipo | Límites de modo |
| - | - |
| `dcp` | 5K, 60Hz, 10bpp (información proporcionada por Apple, no probada) |
| `dcpext` | 6K, 60Hz, 10bpp (información proporcionada por Apple, no probada) |

Restricciones de enrutamiento M1:

| Controlador | Pantalla interna | HDMI | USB-C |
| - | - | - | - |
| `dcp` | + | + | |
| `dcpext` | | | + |

Restricciones de enrutamiento M2 y posteriores:

| Controlador | Pantalla interna | HDMI | USB-C |
| - | - | - | - |
| `dcp` | + | + | + |
| `dcpext` |  | + | + |

Información específica del SoC:

| SoC | Número de `dcp` | Número de `dcpext` | Notas |
| - | - | - | - |
| M1 | 1 | 1 | |
| M1 Pro | 1 | 2 | |
| M1 Max | 1 | 4 |
| M1 Ultra | 1 | 8 | No hay dispositivos Ultra con pantalla interna. `dcp` está deshabilitado en uno de los dies, otro `dcp` está enrutado a HDMI |
| M2 | 1 | 1
| M2 Pro | 1 | 2
| M2 Max | 1 | 4
| M2 Ultra | 0 | 8 | No hay dispositivos Ultra con pantalla interna. `dcp` en ambos dies están deshabilitados |
| M3 | 1 | 1 |
| M3 Pro | 1 | 2 |
| M3 Max | 1 | 4 |
| M4 | ? | ? | Por determinar |
| M4 Pro | ? | ? | Por determinar |
| M4 Max | ? | ? | Por determinar | 