<?php

namespace App\Events;

use App\Models\Post;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PostUpdateEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $Post;
    
    /**
     * Create a new event instance.
     *
     * @param Post $Post
     * @return void
     */
    public function __construct(Post $Post)
    {
        $this->Post = $Post;
    }
}
