const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react('resources/js/app.js', 'js')
    .sass('resources/sass/app.scss', 'css')
    .extract(['collect.js', 'axios'])
;

mix.disableNotifications();

// mix.browserSync({
//     proxy: 'adoc.test',
//     open: false
// });

mix.options.publicPath = 'dist/';
mix.setPublicPath('public/dist').setResourceRoot('/dist/');
