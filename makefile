.PHONY: deploy build

deploy: build
	parse deploy

build:
	lessc public/styles/styles.less > public/styles/styles.css

clean:
	rm public/styles/styles.css
