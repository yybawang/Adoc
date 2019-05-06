<?php

namespace App\Listeners;

use App\Events\PostLikeEvent;
use App\Models\Post;
use App\Models\PostEvent;
use App\Models\User;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class PostLikeListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  PostLikeEvent  $event
     * @return void
     */
    public function handle(PostLikeEvent $event)
    {
        $PostLike = $event->PostLike;
        $Post = Post::find($PostLike->post_id);
        $User = User::find($PostLike->user_id);
        $description = "{$User->name} 点赞了文档 {$Post->name} {$Post->updated_at}";
    
        PostEvent::create([
            'project_id'    => $Post->project_id,
            'post_id'       => $Post->id,
            'user_id'       => $Post->user_id,
            'description'   => $description,
        ]);
    }
}
