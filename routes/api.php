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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::namespace('Api')->group(function(){
    Route::get('/', 'IndexController@index');
    Route::get('/{id}', 'IndexController@project');
    Route::get('/post/{id}', 'IndexController@post');
    Route::post('/login', 'UserController@login');
    Route::post('/register', 'UserController@register');
    
    Route::middleware('auth:api')->group(function(){
        Route::get('/project/{id}', 'ProjectController@detail');
        Route::post('/project/{id}', 'ProjectController@store');
        Route::delete('/project/{id}', 'ProjectController@destroy');
        Route::get('/project/{project_id}/permission', 'ProjectController@permission');
        Route::post('/project/{project_id}/user/{keyword}', 'ProjectController@permission_user')->name('添加权限关键词搜索用户');
        Route::post('/project/{project_id}/permission/{user_id}', 'ProjectController@permission_store');
    });
    Route::resource('project', 'ProjectController');
});
