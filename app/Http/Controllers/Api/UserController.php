<?php


namespace App\Http\Controllers\Api;


use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends BaseController
{
    public function login(Request $request){
        ['email' => $email, 'password' => $password] = $request->validate([
            'email'     => 'required|email',
            'password'  => 'required|min:6',
        ]);
        $User = User::where(['email' => $email])->first();
        if(empty($User)){
            exception(__('此邮箱未注册'));
        }
        $pass = Hash::check($password, $User->password);
        if(!$pass){
            exception(__('密码错误'));
        }
        $token = Str::random(60);
        $User->api_token = $token;
        $User->save();
        return $this->success($User);
    }
    
    public function register(Request $request){
        $post = $request->validate([
            'name'      => 'required|min:3',
            'email'     => 'required|email',
            'password'  => 'required|min:6',
        ]);
        $token = Str::random(60);
        $post['password'] = Hash::make($post['password']);
        $post['api_token'] = $token;
        $User = User::create($post);
        return $this->success($User);
    }
    
    /**
     * 验证登陆人的登陆密码
     * @param Request $request
     * @return array
     */
    public function check_password(Request $request){
        $User = User::find(Auth::id());
        $password = $request->input('password');
        $pass = Hash::check($password, $User->password);
        if(!$pass){
            exception(__('密码错误'));
        }
        return $this->success();
    }
}
