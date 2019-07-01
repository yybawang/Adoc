<?php

namespace App\Listeners;

use App\Events\PostUpdateEvent;
use App\Models\PostEvent;

class PostUpdateListener
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
     * @param  PostUpdateEvent  $event
     * @return void
     */
    public function handle(PostUpdateEvent $event)
    {
        $Post = $event->Post;
        $description = '<abbr title="{$user_email}">{$user_name}</abbr> 编辑了文档 「{$post_name}」<span class="text-muted float-right">{$updated_at}</span>';
        
        PostEvent::create([
            'project_id'    => $Post->project_id,
            'post_id'       => $Post->id,
            'user_id'       => $Post->user_id,
            'description'   => $description,
        ]);
    }
}
