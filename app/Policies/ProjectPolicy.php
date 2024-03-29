<?php

namespace App\Policies;

use App\Models\ProjectPermission;
use App\Models\User;
use App\Models\Project;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
{
    use HandlesAuthorization;

    /**
     * 项目权限判断，2 个必要因素
     * 1. 项目权限表有当前用户
     * 2. 需要是管理员
     *
     * @param  User  $user
     * @param  Project  $project
     * @return mixed
     */
    public function view(User $user, Project $project)
    {
        return $this->authRead($user->id, $project);
    }

    // 创建新项目权限，任何人都可以创建
    public function create(User $user)
    {
        return true;
    }
    
    // 修改权限
    public function update(User $user, Project $project)
    {
        return $this->authWrite($user->id, $project);
    }
    
    // 转让所属人权限
    public function transfer(User $user, Project $project)
    {
        return $this->authAdmin($user->id, $project);
    }

    // 删除项目
    public function delete(User $user, Project $project)
    {
        return $this->authAdmin($user->id, $project);
    }
    
    // 配置权限
    public function permission(User $user, Project $project){
        return $this->authAdmin($user->id, $project);
    }
    
    // 自定义模版
    public function template(User $user, Project $project){
        return $this->authWrite($user->id, $project);
    }
    
    
    
    
    
    
    
    /**
     * 读权限权限，基本权限
     * @param $user_id
     * @param $Project
     * @return bool
     */
    private function authRead($user_id, $Project){
        // 是否是所属人
        if($Project->type == 0 || $Project->user_id == $user_id){
            return true;
        }
        $permission = ProjectPermission::where(['project_id' => $Project->id, 'user_id' => $user_id])->first();
        return $permission ? true : false;
    }
    
    /**
     * 可写权限
     * @param $user_id
     * @param $Project
     * @return bool
     */
    private function authWrite($user_id, $Project){
        // 是否是所属人
        if($Project->user_id == $user_id){
            return true;
        }
        $permission = ProjectPermission::where(['project_id' => $Project->id, 'user_id' => $user_id, 'write' => 1])->first();
        return $permission ? true : false;
    }
    
    /**
     * 管理员权限
     * 控制转让/删除
     * @param $user_id
     * @param $Project
     * @return bool
     */
    private function authAdmin($user_id, $Project){
        // 是否是所属人
        if($Project->user_id == $user_id){
            return true;
        }
        $permission = ProjectPermission::where(['project_id' => $Project->id, 'user_id' => $user_id, 'admin' => 1])->first();
        return $permission ? true : false;
    }
}
