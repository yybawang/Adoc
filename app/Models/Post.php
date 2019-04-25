<?php

namespace App\Models;

class Post extends Model
{
    /**
     * 附件列表
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function attachment(){
        return $this->hasMany(PostAttachment::class);
    }
    
    /**
     * 保存历史记录
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function history(){
        return $this->hasMany(PostHistory::class);
    }
}
