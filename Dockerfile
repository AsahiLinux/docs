FROM registry.fedoraproject.org/fedora:42

LABEL org.opencontainers.image.description="Build the Asahi Linux documentation website using mkdocs"
LABEL org.opencontainers.image.licenses=MIT
LABEL org.opencontainers.image.source=https://github.com/AsahiLinux/docs
LABEL org.opencontainers.image.vendor="Asahi Linux"

RUN dnf -y install git-core mkdocs-material mkdocs-material+imaging python3-mkdocs-redirects && dnf -y clean all

RUN mkdir /docs

WORKDIR /docs

EXPOSE 8000
ENTRYPOINT ["mkdocs"]
CMD ["serve", "--dev-addr=0.0.0.0:8000"]
