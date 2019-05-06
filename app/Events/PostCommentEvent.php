<?php

namespace App\Events;

use App\Models\PostComment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PostCommentEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $PostComment;
    
    /**
     * Create a new event instance.
     *
     * @param PostComment $PostComment
     * @return void
     */
    public function __construct(PostComment $PostComment)
    {
        $this->PostComment = $PostComment;
    }
}
