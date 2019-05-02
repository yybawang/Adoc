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
    
    /**
     * 递归得到文档列表
     * @param $project_id
     * @param int $pid
     * @return \Illuminate\Support\Collection
     */
    public function children($project_id, $pid = 0){
        return $this->_children($project_id, $pid);
    }
    private function _children($project_id, $pid){
        $res = Post::where(['project_id' => $project_id, 'pid' => $pid])->get()->each(function($v) use ($project_id){
           $v->children = $this->_children($project_id, $v->id);
        });
        return $res;
    }
}
