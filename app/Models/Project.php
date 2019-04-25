<?php

namespace App\Models;

class Project extends Model
{
    
    /**
     * 所属父级项目组
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function group(){
        return $this->belongsTo(ProjectGroup::class);
    }
    
    /**
     * 权限列表
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function permission(){
        return $this->hasMany(ProjectPermission::class);
    }
}
