<?php

use App\Http\Middleware\AuthApi;
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
    Route::post('/project/{id}/search', 'ProjectController@search');
    Route::get('/post/{id}', 'IndexController@post');
    Route::post('/upload_md', 'IndexController@upload_md');
    Route::get('/user', 'UserController@user');
    Route::post('/login', 'UserController@login');
    Route::any('/logout', 'UserController@logout');
    Route::post('/register', 'UserController@register');
    
    Route::middleware(['auth:api'])->group(function(){
        // 公用的
        Route::post('/password_check', 'UserController@password_check')->name('password_check');
        Route::patch('/password', 'UserController@password_update')->name('password_update');
        
        Route::get('/project/{project}/edit', 'ProjectController@detail')->middleware('can:update,project');
        Route::post('/project', 'ProjectController@store')->middleware('can:create,App\Models\Project');
        Route::patch('/project/{project}', 'ProjectController@update')->middleware('can:update,project');
        Route::patch('/project/{project}/transfer', 'ProjectController@transfer')->middleware('can:transfer,project');
        Route::delete('/project/{project}', 'ProjectController@delete')->middleware('can:delete,project');
        
        Route::get('/project/{project}/permission', 'ProjectController@permission')->middleware('can:permission,project');
        Route::get('/project/{project}/permission/{keyword}', 'ProjectController@permission_user')->middleware('can:permission,project');
        Route::post('/project/{project}/permission', 'ProjectController@permission_store')->middleware('can:permission,project');
        Route::delete('/project/{projectPermission}/permission', 'ProjectController@permission_delete')->middleware('can:permission,projectPermission');
        
        Route::get('/project/{project}/template', 'ProjectController@template')->middleware('can:template,project');
        Route::post('/project/{project}/template', 'ProjectController@template_store')->middleware('can:template,project');
        Route::delete('/project/{postTemplate}/template', 'ProjectController@template_delete')->middleware('can:delete,postTemplate');
        
        Route::get('/post/{post}/edit', 'PostController@detail')->middleware('can:update,post');
        Route::get('/post/{project}/{id}/children', 'PostController@children')->middleware('can:update,project');
        Route::post('/post/{project}/parents/{id}', 'PostController@parents')->middleware('can:update,project');
        Route::post('/post/{id}', 'PostController@store')->middleware('can:create,App\Models\Post');
        Route::delete('/post/{post}', 'PostController@delete')->middleware('can:delete,post');
        
        Route::get('/post/{post}/history', 'PostController@history')->middleware('can:view,post');
        Route::delete('/post/{postHistory}/history', 'PostController@history_delete')->middleware('can:delete,postHistory');
        
        Route::post('/like/{post}', 'PostController@like');
        Route::post('/comment/{post}', 'PostController@comment');
        Route::post('/comment/{postComment}/like', 'PostController@comment_like');
    });
});
