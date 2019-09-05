<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\PostComment;
use App\Models\Project;
use App\Models\ProjectPermission;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostCommentPolicy
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
    
    public function view(User $user, PostComment $postComment){
        $project_id = Post::where('id', $postComment->post_id)->value('project_id');
        return $this->authRead($user->id, $project_id);
    }
    
    public function delete(User $user, PostComment $postComment){
        $project_id = Post::where('id', $postComment->post_id)->value('project_id');
        return $this->authWrite($user->id, $project_id);
    }
    
    
    /**
     * 可读权限
     * @param $user_id
     * @param $project_id
     * @return bool
     */
    private function authRead($user_id, $project_id){
        // 是否是所属人
        $Project = Project::find($project_id);
        if($Project->type == 0 || $Project->user_id == $user_id){
            return true;
        }
        $permission = ProjectPermission::where(['project_id' => $project_id, 'user_id' => $user_id])->first();
        return $permission ? true : false;
    }
    
    /**
     * 可写权限
     * @param $user_id
     * @param $project_id
     * @return bool
     */
    private function authWrite($user_id, $project_id){
        // 是否是所属人
        $Project = Project::find($project_id);
        if($Project->user_id == $user_id){
            return true;
        }
        $permission = ProjectPermission::where(['project_id' => $project_id, 'user_id' => $user_id, 'write' => 1])->first();
        return $permission ? true : false;
    }
}
