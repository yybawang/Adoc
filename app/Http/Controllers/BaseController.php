<?php

namespace App\Http\Controllers;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class BaseController extends Controller
{
    /**
     * 检查登陆状态
     * 可单独使用
     */
    public function auth_check(){
        $logined = Auth::check();
        abort_unless($logined, 401, 'Login first');
    }
}
