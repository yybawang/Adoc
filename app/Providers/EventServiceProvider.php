<?php

namespace App\Providers;

use App\Events\PostCommentEvent;
use App\Events\PostDeleteEvent;
use App\Events\PostLikeEvent;
use App\Events\PostStoreEvent;
use App\Events\PostUpdateEvent;
use App\Listeners\PostCommentListener;
use App\Listeners\PostDeleteListener;
use App\Listeners\PostLikeListener;
use App\Listeners\PostStoreListener;
use App\Listeners\PostUpdateListener;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        PostStoreEvent::class => [
            PostStoreListener::class
        ],
        PostUpdateEvent::class => [
            PostUpdateListener::class
        ],
        PostLikeEvent::class => [
            PostLikeListener::class
        ],
        PostCommentEvent::class => [
            PostCommentListener::class
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
