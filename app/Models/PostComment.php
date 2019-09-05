<?php
/**
 * 文档评论
 * 1、回复评论
 * 2、@某人
 */
namespace App\Models;

class PostComment extends Model
{
    /**
     * 点赞列表
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function likes(){
        return $this->hasMany(PostCommentLike::class);
    }
    
    /**
     * 点赞的 emoji 表情分组
     * @return \Illuminate\Database\Eloquent\Relations\HasMany|\Illuminate\Database\Query\Builder
     */
    public function likeEmojis(){
        return $this->hasMany(PostCommentLike::class)->selectRaw("id, post_comment_id, code, emoji, count(*) as count")->groupBy('post_comment_id')->groupBy('code')->latest('count')->oldest();
    }
    
    public function user(){
        return $this->belongsTo(User::class);
    }
    
    /**
     * 评论引用的上级评论
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function parent(){
        return $this->hasOne(PostComment::class, 'pid', 'id');
    }
}
