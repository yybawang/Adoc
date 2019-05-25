<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use \App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', 'Controller@index');

//Auth::routes();

Route::get('sandbox/test', 'SandboxController@test');


Route::view('/{path?}/{path2?}/{path3?}/{path4?}/{path5?}/{path6?}', 'app');
