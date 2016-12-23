# Remove existing django migrations
run-server:
	@echo ">> Start the cf mock server"
	nodemon server/server.js

lint:
	./node_modules/.bin/eslint src/.

# usage:
# make help
# :)
help:
	@echo "    lint"
	@echo "        Run lint."
	@echo "    run-server"
	@echo "        Run the mock Cloudflare challenge server."
