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
        return $this->success([
            'id'    => $User->id,
            'email' => $User->email,
            'name'  => $User->name,
            'api_token' => $token,
        ]);
    }
    
    public function register(Request $request){
        $post = $request->validate([
            'name'      => 'required',
            'email'     => 'required|email',
            'password'  => 'required|min:6',
        ]);
        $token = Str::random(60);
        $post['password'] = Hash::make($post['password']);
        $post['api_token'] = $token;
        $User = User::create($post);
        return $this->success([
            'id'    => $User->id,
            'email' => $User->email,
            'name'  => $User->name,
            'api_token' => $token,
        ]);
    }
    
    public function logout(){
        Auth::logout();
        return $this->success();
    }
    
    /**
     * 获取登陆人基本信息
     * @param Request $request
     * @return mixed
     */
    public function user(Request $request){
        $user = Auth::guard('api')->user() ?? [];
        return $this->success($user);
    }
    
    /**
     * 验证登陆人的登陆密码
     * @param Request $request
     * @return array
     */
    public function password_check(Request $request){
        $User = User::find(Auth::id());
        $password = $request->input('password');
        $pass = Hash::check($password, $User->password);
        if(!$pass){
            exception(__('密码错误'));
        }
        return $this->success();
    }
    
    /**
     * 修改用户密码
     * @param Request $request
     * @return mixed
     */
    public function password_update(Request $request){
        $post = $request->validate([
            'password_old'  => 'required|min:6',
            'password'      => 'required|confirmed|min:6',
        ]);
        $User = User::find(Auth::id());
        $password_old = $post['password_old'];
        $pass = Hash::check($password_old, $User->password);
        if(!$pass){
            exception(__('密码错误'));
        }
        User::where('id', $User->id)->update(['password' => Hash::make($post['password'])]);
        return $this->success();
    }
}
