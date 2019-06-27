<?php

namespace App\Policies;

use App\Models\PostTemplate;
use App\Models\ProjectPermission;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostTemplatePolicy
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
    
    public function delete(User $user, PostTemplate $postTemplate){
        return $this->authWrite($user->id, $postTemplate->project_id);
    }
    
    
    
    
    /**
     * 可写权限
     * @param $user_id
     * @param $project_id
     * @return bool
     */
    private function authWrite($user_id, $project_id){
        $permission = ProjectPermission::where(['project_id' => $project_id, 'user_id' => $user_id, 'write' => 1])->first();
        return $permission ? true : false;
    }
}
