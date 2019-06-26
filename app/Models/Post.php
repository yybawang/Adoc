<?php

namespace App\Models;

use Illuminate\Support\Collection;

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
    public function histories(){
        return $this->hasMany(PostHistory::class);
    }
    
    public function events(){
        return $this->hasMany(PostEvent::class);
    }
    
    /**
     * 留言列表
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments(){
        return $this->hasMany(PostComment::class)->where('pid', 0)->latest()->limit(10);
    }
    
    public function likes(){
        return $this->hasMany(PostLike::class);
    }
    
    public function getToggleAttribute(){
        return $this->attributes['open'] = true;
    }
    
    /**
     * 递归上级文章
     * @return mixed
     */
    public function parentsEach(){
        return $this->_parentsEach($this->pid)->reverse()->values();
    }
    private function _parentsEach($pid){
        $res = collect();
        $Parent = Post::select('id', 'pid', 'name')->where(['id' => $pid])->active()->first();
        if($Parent){
//            $Parents = Post::select('id', 'pid', 'name')->where(['pid' => $Parent->pid])->active()->get();
//            if($Parents->isNotEmpty()){
//                $Parents = collect([['id' => '', 'pid' => 0, 'name' => '-- 选择 --']])->merge($Parents);
//            }
//            $Parent->children = $Parents;
//            if($Parent->siblings){
//                $Parent->siblings = collect([['id' => 0, 'pid' => 0, 'name' => '-- 选择 --']])->merge($Parent->siblings);
//            }
            $parent = $this->_parentsEach($Parent->pid);
            $res->push($Parent->id);
            $res = $res->merge($parent);
        }
        return $res;
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
            $v->append('toggle');
           $v->children = $this->_children($project_id, $v->id, $field);
        });
        return $res;
    }
}
