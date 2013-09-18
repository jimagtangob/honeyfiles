PWD := $(shell pwd)

build:
	./node_modules/.bin/handlebars ./views/templates -m -r './views/templates' -f ./public/javascripts/templates.js

.PHONY: build
