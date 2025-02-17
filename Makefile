help:
	@echo "Run 'make test' to test locally or 'make build' to render the static site"

build:
	mkdocs build

clean:
	rm -rf site

test:
	mkdocs serve

.PHONY: help build test
