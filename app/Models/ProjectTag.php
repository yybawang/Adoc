<?php

namespace App\Models;

class ProjectTag extends Model
{
    /**
     * 反向关联项目
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function project(){
        return $this->belongsTo(Project::class);
    }
}
