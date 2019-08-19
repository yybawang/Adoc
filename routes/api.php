<?php
namespace App\Http\Controllers\Api;

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
    Route::get('/', [IndexController::class, 'index']);
    Route::get('/project/{id}', [IndexController::class, 'project']);
    Route::get('/project/{id}/posts', [IndexController::class, 'posts']);
    Route::get('/project/{id}/events', [IndexController::class, 'events']);
    Route::post('/project/{id}/search', [ProjectController::class, 'search']);
    Route::get('/post/{id}', [IndexController::class, 'post']);
    Route::post('/upload', [BaseController::class, 'upload']);
    Route::post('/upload_md', [IndexController::class, 'upload_md']);
    Route::get('/user', [UserController::class, 'user']);
    Route::post('/login', [UserController::class, 'login']);
    Route::any('/logout', [UserController::class, 'logout']);
    Route::post('/register', [UserController::class, 'register']);
    
    Route::middleware(['auth:api'])->group(function(){
        // 公用的
        Route::post('/password_check', [UserController::class, 'password_check'])->name('password_check');
        Route::patch('/password', [UserController::class, 'password_update'])->name('password_update');
        
        Route::get('/project/{project}/edit', [ProjectController::class, 'detail'])->middleware('can:update,project');
        Route::post('/project', [ProjectController::class, 'store'])->middleware('can:create,App\Models\Project');
        Route::patch('/project/{project}', [ProjectController::class, 'update'])->middleware('can:update,project');
        Route::patch('/project/{project}/transfer', [ProjectController::class, 'transfer'])->middleware('can:transfer,project');
        Route::delete('/project/{project}', [ProjectController::class, 'delete'])->middleware('can:delete,project');
        Route::post('/project/{project}/export/{pid}', [ProjectController::class, 'export'])->middleware('can:view,project');
        
        Route::get('/project/{project}/permission', [ProjectController::class, 'permission'])->middleware('can:permission,project');
        Route::get('/project/{project}/permission/{keyword}', [ProjectController::class, 'permission_user'])->middleware('can:permission,project');
        Route::post('/project/{project}/permission', [ProjectController::class, 'permission_store'])->middleware('can:permission,project');
        Route::delete('/project/{projectPermission}/permission', [ProjectController::class, 'permission_delete'])->middleware('can:permission,projectPermission');
        
        Route::get('/project/{project}/template', [ProjectController::class, 'template'])->middleware('can:template,project');
        Route::post('/project/{project}/template', [ProjectController::class, 'template_store'])->middleware('can:template,project');
        Route::delete('/project/{postTemplate}/template', [ProjectController::class, 'template_delete'])->middleware('can:delete,postTemplate');
        
        Route::get('/post/{post}/edit', [PostController::class, 'detail'])->middleware('can:update,post');
        Route::get('/post/{project}/{id}/children', [PostController::class, 'children'])->middleware('can:update,project');
        Route::post('/post/{project}/parents/{id}', [PostController::class, 'parents'])->middleware('can:update,project');
        Route::post('/post/{id}', [PostController::class, 'store'])->middleware('can:create,App\Models\Post');
        Route::delete('/post/{post}', [PostController::class, 'delete'])->middleware('can:delete,post');
        Route::post('/post/{post}/export', [PostController::class, 'export'])->middleware('can:view,post');
        Route::post('/post/{project}/sort', [PostController::class, 'sort'])->middleware('can:update,project');
        
        Route::get('/post/{post}/history', [PostController::class, 'history'])->middleware('can:view,post');
        Route::delete('/post/{postHistory}/history', [PostController::class, 'history_delete'])->middleware('can:delete,postHistory');
        
        Route::post('/like/{post}', [PostController::class, 'like']);
        Route::post('/comment/{post}', [PostController::class, 'comment']);
        Route::post('/comment/{postComment}/like', [PostController::class, 'comment_like']);
    });
});
