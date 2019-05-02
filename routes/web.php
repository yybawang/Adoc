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

Route::apiResource('message', 'MessageController');
Route::patch('message/read/{id}', 'MessageController@read');
Route::patch('message/read_all/{type}', 'MessageController@read_all');

Route::prefix('post')->group(function(){
    Route::get('project/{project_id}', \App\Http\Controllers\PostController::class . '@index');
    Route::get('{id}', \App\Http\Controllers\PostController::class . '@show');
    Route::patch('{id}', \App\Http\Controllers\PostController::class . '@update');
    Route::delete('{id}', \App\Http\Controllers\PostController::class . '@destroy');
});

Route::apiResource('post_comment', 'PostCommentCommentController');

Route::apiResource('post_history', 'PostHistoryController');
Route::apiResource('post_like', 'PostLikeController');
Route::apiResource('post_template', 'PostTemplateController');
Route::apiResource('project', 'ProjectController');
Route::apiResource('project_group', 'ProjectGroupController');
Route::apiResource('project_permission', 'ProjectPermissionController');
