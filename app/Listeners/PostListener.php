<?php

namespace App\Listeners;

use App\Events\PostStoreEvent;
use App\Models\PostEvent;
use App\Models\User;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class PostListener
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
     * @param  PostStoreEvent  $event
     * @return void
     */
    public function handle(PostStoreEvent $event)
    {
        $Post = $event->Post;
        $User = User::where(['id' => $Post->user_id])->first();
        $description = "{$User->name} 编辑了文档 {$Post->name} {$Post->updated_at}";
        
        PostEvent::create([
            'project_id'    => $Post->project_id,
            'post_id'       => $Post->id,
            'user_id'       => $Post->user_id,
            'description'   => $description,
        ]);
    }
}
