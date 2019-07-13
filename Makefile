.PHONY: dependency-install file-permission

dependency: dependency-install file-permission
install: app-install dump-autoload npm-install

help:
	@echo 'make install -- download dependencies and install'

dependency-install:
	composer install
	composer dumpautoload

npm-install:
	npm install
	npm run prod

app-install:
	php artisan key:generate
	php artisan storage:link
	php artisan migrate

file-permission:
	chmod -R 777 storage/
	chmod -R 777 bootstrap/cache/


dump-autoload:
	php artisan clear-compiled

