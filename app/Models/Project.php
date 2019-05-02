<?php

namespace App\Models;

class Project extends Model
{
    
    /**
     * 所属父级项目组
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tags(){
        return $this->hasMany(ProjectTag::class);
    }
    
    /**
     * 文档列表
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function posts(){
        return $this->hasMany(Post::class);
    }
    
    /**
     * 权限列表
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function permissions(){
        return $this->hasMany(ProjectPermission::class);
    }
    
    /**
     * 文档 CRUD 事件列表，发生在文档上，但都归属于项目
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function events(){
        return $this->hasMany(PostEvent::class);
    }
    
    /**
     * 项目文档模版
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function templates(){
        return $this->hasMany(PostTemplate::class);
    }
    
    /**
     * 项目置顶
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tops(){
        return $this->hasMany(ProjectTop::class);
    }
}
