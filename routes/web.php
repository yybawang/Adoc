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

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', 'Controller@app');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::resource('message', 'MessageController');
Route::patch('message/read/{id}', 'MessageController@read');
Route::patch('message/read_all/{type}', 'MessageController@read_all');

Route::resource('post_comment', 'PostCommentCommentController');
Route::resource('post', 'PostController');
Route::resource('post_history', 'PostHistoryController');
Route::resource('post_like', 'PostLikeController');
Route::resource('post_template', 'PostTemplateController');
Route::resource('project', 'ProjectController');
Route::resource('project_group', 'ProjectGroupController');
Route::resource('project_permission', 'ProjectPermissionController');
