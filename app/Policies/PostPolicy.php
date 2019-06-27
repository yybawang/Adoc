<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\ProjectPermission;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostPolicy
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
    
    public function view(User $user, Post $post){
        return $this->authRead($user->id, $post->project_id);
    }
    
    public function create(User $user){
        return $this->authWrite($user->id, request()->input('project_id'));
    }
    
    public function update(User $user, Post $post){
        return $this->authWrite($user->id, $post->project_id);
    }
    
    public function delete(User $user, Post $post){
        return $this->authWrite($user->id, $post->project_id);
    }
    
    
    private function authRead($user_id, $project_id){
        $permission = ProjectPermission::where(['project_id' => $project_id, 'user_id' => $user_id])->first();
        return $permission ? true : false;
    }
    
    private function authWrite($user_id, $project_id){
        $permission = ProjectPermission::where(['project_id' => $project_id, 'user_id' => $user_id, 'write' => 1])->first();
        return $permission ? true : false;
    }
}
