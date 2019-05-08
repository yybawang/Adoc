<?php

namespace App\Listeners;

use App\Events\PostCommentEvent;
use App\Models\Post;
use App\Models\PostComment;
use App\Models\PostEvent;
use App\Models\User;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class PostCommentListener
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
     * @param  PostCommentEvent  $event
     * @return void
     */
    public function handle(PostCommentEvent $event)
    {
        $PostComment = $event->PostComment;
        $Post = Post::find($PostComment->post_id);
        $description = '<abbr title="{$user_email}">{$user_name}</abbr> 评论了文档 「{$post_name}」<span class="text-muted float-right">{$updated_at}</span>';
    
        PostEvent::create([
            'project_id'    => $Post->project_id,
            'post_id'       => $Post->id,
            'user_id'       => $Post->user_id,
            'description'   => $description,
        ]);
    }
}
