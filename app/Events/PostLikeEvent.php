<?php

namespace App\Events;

use App\Models\PostLike;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PostLikeEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $PostLike;
    
    /**
     * Create a new event instance.
     *
     * @param PostLike $PostLike
     * @return void
     */
    public function __construct(PostLike $PostLike)
    {
        $this->PostLike = $PostLike;
    }
}
