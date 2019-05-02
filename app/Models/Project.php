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
        return $this->hasMany(Project::class);
    }
}
