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
The site is generated using [Zensical](https://zensical.org). Zensical is installed as
a Python package. If your distro does not package it, it is available via `pip`. To build
the docs locally for testing, simply install Zensical and run
```
$ zensical serve
```

The website is rebuilt by the CI on every commit and served via GitHub Pages.
