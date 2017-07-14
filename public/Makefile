build:
	- rm -r dist/
	mkdir dist
	jspm bundle-sfx ./app/main.js ./dist/app.js
	./node_modules/.bin/uglifyjs ./dist/app.js -o ./dist/app.min.js

	mkdir ./dist/static
	cp -R ./static/* ./dist/static/