# Asahi Linux documentation repository
This is the [Asahi Linux documentation](https://asahilinux.org/docs/) repository.

## Documentation structure
Our documentation is organised into categories.

- alt: Alternative operating system/Linux distribution support documentation
  should go here.
- fw: Documentation on vendor-controlled firmware and firmware interfaces should
  go here.
- hw: Any documentation related to hardware belongs here. This is further split
  into subcategories:
    - cpu: Application processor documentation
    - devices: Documentation relating to specific Mac models
    - peripherals: hardware found in Apple Silicon Macs but not the SoC itself
    - soc: hardware blocks integrated into Apple Silicon SoCs
- platform: Documentation that applies across the Apple Silicon platform
- project: Project admin documents and stuff unrelated to hardware or software
- sw: Documentation for non-firmware software

## Usage

This is made with [MkDocs](https://www.mkdocs.org/). If you have mkdocs installed
already, run `make build` to build the site, or `make test` to spin up a local webserver
for review. If you don't, feel free to use our [container](https://github.com/AsahiLinux/docs/pkgs/container/mkdocs-asahi)
with something like:

```
$ podman run -it --pull=newer -p=8000:8000 -v=$(pwd)/:/docs:z ghcr.io/asahilinux/mkdocs-asahi:latest
```

if you're using [Podman](https://podman.io), or

```
$ docker run -it --pull=always -p=8000:8000 -v=$(pwd)/:/docs:z ghcr.io/asahilinux/mkdocs-asahi:latest
```

if you're using [Docker](https://www.docker.com). Note that this repository uses
[Git Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules), so you'll
want to set those up first with `git submodule update --init`.

The website is rebuilt by the CI on every commit and served via GitHub Pages.
The container is also automatically updated and pushed to the registry.
