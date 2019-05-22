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
    Route::get('/menu', 'IndexController@menu');
    Route::get('/user', 'UserController@user');
    Route::post('/login', 'UserController@login');
    Route::post('/register', 'UserController@register');
    
    Route::middleware(['auth:api'])->group(function(){
        // 公用的
        Route::post('/password_check', 'UserController@password_check');
        
        Route::get('/project/{project}/edit', 'ProjectController@detail')->middleware('can:view,project');
        Route::post('/project', 'ProjectController@store')->middleware('can:create,App\Models\Project');
        Route::patch('/project/{project}', 'ProjectController@update')->middleware('can:update,project');
        Route::patch('/project/{project}/transfer', 'ProjectController@transfer')->middleware('can:transfer,project');
        Route::delete('/project/{project}', 'ProjectController@delete')->middleware('can:delete,project');
        
        Route::get('/project/{project}/permission', 'ProjectController@permission')->middleware('can:permission,project');
        Route::get('/project/permission/user/{keyword}', 'ProjectController@permission_user')->middleware('can:permission,App\Models\Project');
        Route::post('/project/{project}/permission', 'ProjectController@permission_store')->middleware('can:permission,project');
        Route::delete('/project/{projectPermission}/permission', 'ProjectController@permission_delete')->middleware('can:permission,projectPermission');
        
        Route::get('/project/{project}/template', 'ProjectController@template')->middleware('can:template,project');
        Route::post('/project/{project}/template', 'ProjectController@template_store')->middleware('can:template,project');
        Route::delete('/project/{postTemplate}/template', 'ProjectController@template_delete')->middleware('can:delete,postTemplate');
        
        Route::get('/post/{post}/edit', 'PostController@detail')->middleware('can:view,post');
        Route::get('/post/{post}/children', 'PostController@children')->middleware('can:view,post');
        Route::get('/post/{post}/parent', 'PostController@parent')->middleware('can:view,post');
        Route::post('/post/', 'PostController@store')->middleware('can:create,App\Models\Post');
        Route::patch('/post/{post}', 'PostController@update')->middleware('can:update,post');
        
        Route::get('/post/{postHistory}/history', 'PostController@history')->middleware('can:view,postHistory');
        
        Route::post('/like/{id}', 'PostController@like')->middleware('can:view,App\Models\Post');
        Route::post('/comment/{id}', 'PostController@comment')->middleware('can:view,App\Models\Post');
        Route::post('/comment/{comment_id}/like', 'PostController@comment_like')->middleware('can:view,App\Models\Post');
    
        Route::post('/user/password', 'UserController@password_update')->name('password_update');
    });
});
