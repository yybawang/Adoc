<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::namespace('Api')->group(function(){
    Route::get('/', 'IndexController@index');
    Route::get('/project/{id}', 'IndexController@project');
    Route::get('/project/{id}/posts', 'IndexController@posts');
    Route::get('/project/{id}/events', 'IndexController@events');
    Route::get('/post/{id}', 'IndexController@post');
    Route::post('/upload_md', 'IndexController@upload_md');
    Route::get('/menu', 'IndexController@menu');
    Route::get('/user', 'UserController@user');
    Route::post('/login', 'UserController@login');
    Route::post('/register', 'UserController@register');
    
    Route::middleware('auth:api')->group(function(){
        // 公用的
        Route::post('/password_check', 'UserController@password_check');
        
        Route::get('/project/{id}/edit', 'ProjectController@detail');
        Route::post('/project/{id}/search', 'ProjectController@search');
        Route::post('/project/{id}', 'ProjectController@store');
        Route::patch('/project/{id}', 'ProjectController@transfer');
        Route::delete('/project/{id}', 'ProjectController@destroy');
        Route::get('/project/{project_id}/permission', 'ProjectController@permission');
        Route::get('/project/permission/user/{keyword}', 'ProjectController@permission_user');
        Route::post('/project/{project_id}/permission', 'ProjectController@permission_store');
        Route::delete('/project/{project_id}/permission', 'ProjectController@permission_destroy');
        Route::get('/project/{project_id}/template', 'ProjectController@template');
        Route::post('/project/{project_id}/template', 'ProjectController@template_store');
        
        Route::get('/post/{id}/edit', 'PostController@detail');
        Route::get('/post/{id}/children', 'PostController@children');
        Route::get('/post/{pid}/parent', 'PostController@parent');
        Route::post('/post/{id}', 'PostController@store');
        Route::get('/post/{post_id}/history', 'PostController@history');
        
        Route::post('/like/{post_id}', 'PostController@like');
        Route::post('/comment/{post_id}', 'PostController@comment');
        Route::post('/comment/{comment_id}/like', 'PostController@comment_like');
    
        Route::post('/user/password', 'UserController@password_update');
    });
    Route::resource('project', 'ProjectController');
});
