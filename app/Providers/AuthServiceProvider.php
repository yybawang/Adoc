<?php

namespace App\Providers;

use App\Models\Post;
use App\Models\PostHistory;
use App\Models\PostTemplate;
use App\Models\Project;
use App\Models\ProjectPermission;
use App\Policies\PostHistoryPolicy;
use App\Policies\PostPolicy;
use App\Policies\PostTemplatePolicy;
use App\Policies\ProjectPermissionPolicy;
use App\Policies\ProjectPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
        Project::class => ProjectPolicy::class,
        ProjectPermission::class  => ProjectPermissionPolicy::class,
        PostTemplate::class => PostTemplatePolicy::class,
        Post::class => PostPolicy::class,
        PostHistory::class => PostHistoryPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //
    }
}
