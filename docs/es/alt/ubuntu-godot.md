---
title: Ubuntu Godot
---

**Esta página contiene información específica de la distribución. Este repositorio de documentación**
**no es para documentación específica de distribución. El lugar apropiado para**
**esto es el propio sistema de documentación de la distribución. Esta página será eliminada**
**pronto.**

Probado en Ubuntu 22.10 Asahi en M1 Air.

https://godotengine.org

Construyendo Godot 3.5, porque actualmente 4.x parece bloquearse al iniciar.

https://docs.godotengine.org/en/latest/development/compiling/compiling_for_linuxbsd.html

Consulta [esta página](../alt-distros.md) para más información sobre la instalación de Ubuntu Asahi.

```
sudo apt -y install build-essential scons \
pkg-config libx11-dev libxcursor-dev libxinerama-dev \
libgl1-mesa-dev libglu-dev libasound2-dev \
libpulse-dev libudev-dev libxi-dev libxrandr-dev

git clone https://github.com/godotengine/godot.git

git checkout remotes/origin/3.5

cd godot

scons -j$(nproc) platform=linuxbsd

cd bin

./godot.x11.tools.64
```
Si no tienes la versión con aceleración por hardware de Asahi,
puedes usar GL por software más lento:
```
LIBGL_ALWAYS_SOFTWARE=1 ./godot.x11.tools.64
``` 