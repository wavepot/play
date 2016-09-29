dev:
	@./node_modules/.bin/live-server \
		--no-browser \
		--port=3000

install: package.json
	@npm install

.PHONY: dev
