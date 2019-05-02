<?php

namespace App\Models;

class Post extends Model
{
    
    public function scopeActive($query){
        return $query->where('status', 1);
    }
    
    /**
     * 附件列表
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function attachments(){
        return $this->hasMany(PostAttachment::class);
    }
    
    /**
     * 保存历史记录
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function history(){
        return $this->hasMany(PostHistory::class);
    }
    
    /**
     * 留言列表
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comment(){
        return $this->hasMany(PostComment::class)->where('pid', 0)->latest()->limit(10);
    }
    
    public function likes(){
        return $this->hasMany(PostLike::class);
    }
    
    /**
     * 递归得到文档列表
     * @param $project_id
     * @param int $pid
     * @param string $field
     * @return \Illuminate\Support\Collection
     */
    public function children($project_id, $pid = 0, $field = '*'){
        return $this->_children($project_id, $pid, $field);
    }
    private function _children($project_id, $pid, $field){
        $res = Post::selectRaw($field)->where(['project_id' => $project_id, 'pid' => $pid])->active()->get()->each(function($v) use ($project_id, $field){
           $v->children = $this->_children($project_id, $v->id, $field);
        });
        return $res;
    }
}
