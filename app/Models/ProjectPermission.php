<?php

namespace App\Models;

class ProjectPermission extends Model
{
    
    protected $casts = [
        'write' => 'boolean',
        'admin' => 'boolean',
    ];
    
    /**
     * 反向关联项目
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function project(){
        return $this->belongsTo(Project::class);
    }
    
    /**
     * 反向关联用户信息
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(){
        return $this->belongsTo(User::class)->select('id','name', 'email');
    }
}
