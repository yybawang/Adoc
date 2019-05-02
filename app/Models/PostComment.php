<?php
/**
 * 文档评论
 * 1、回复评论
 * 2、@某人
 */
namespace App\Models;

class PostComment extends Model
{
    
    public function likeEmoji(){
        return $this->hasMany(PostCommentLike::class)->selectRaw("id, post_comment_id, emoji, count(*) as count")->groupBy('post_comment_id')->groupBy('emoji');
    }
    
    /**
     * 评论引用的上级评论
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function parent(){
        return $this->hasOne(PostComment::class, 'pid', 'id');
    }
}
