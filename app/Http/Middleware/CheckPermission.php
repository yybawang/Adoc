<?php

namespace App\Http\Middleware;

use Closure;

class CheckPermission
{
    /**
     * Handle an incoming request.
     * 检查权限
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle($request, Closure $next, string $role)
    {
        // 已认证的用户
        $user = $request->user();
        if(empty($user)){
            exception('用户未认证');
        }
        switch ($role){
            case 'project':
        }
        return $next($request);
    }
}
