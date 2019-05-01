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
}
