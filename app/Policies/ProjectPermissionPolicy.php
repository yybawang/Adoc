<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\ProjectPermission;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPermissionPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }
    
    public function delete(User $user, ProjectPermission $projectPermission){
        return $this->authAdmin($user->id, $projectPermission->project_id);
    }
    
    
    
    /**
     * 管理员权限
     * 控制转让/删除
     * @param $user_id
     * @param $project_id
     * @return bool
     */
    private function authAdmin($user_id, $project_id){
        // 是否是所属人
        $Project = Project::find($project_id);
        if($Project->user_id == $user_id){
            return true;
        }
        $permission = ProjectPermission::where(['project_id' => $project_id, 'user_id' => $user_id, 'admin' => 1])->first();
        return $permission ? true : false;
    }
}
