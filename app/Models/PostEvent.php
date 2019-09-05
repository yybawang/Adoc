<?php

namespace App\Models;

class PostEvent extends Model
{
    /**
     * 对应的用户
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(){
        return $this->belongsTo(User::class);
    }
    
    /**
     * 对应的文档
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function post(){
        return $this->belongsTo(Post::class);
    }
    
    /**
     * 格式化模版变量
     * @return $this
     */
    public function parse(){
        $replaces = [];
        $replaces['user_email'] = $this->user->email;
        $replaces['user_name'] = $this->user->name;
        $replaces['post_name'] = $this->post->name;
        $replaces['updated_at'] = $this->updated_at;
        preg_match_all('/\{\$(.*?)\}/', $this->description, $match);
        foreach($match[0] as $k => $m){
            $this->description = str_replace($m, $replaces[$match[1][$k]], $this->description);
        }
        return $this;
    }
}
