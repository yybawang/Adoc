<?php

namespace App\Http\Controllers\Api;

use App\Events\PostCommentEvent;
use App\Events\PostLikeEvent;
use App\Events\PostStoreEvent;
use App\Events\PostUpdateEvent;
use App\Libraries\Word;
use App\Models\Post;
use App\Models\PostAttachment;
use App\Models\PostComment;
use App\Models\PostCommentLike;
use App\Models\PostEvent;
use App\Models\PostHistory;
use App\Models\PostLike;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class PostController extends BaseController
{
    /**
     * @param Request $request
     * @param Post $post
     * @return mixed
     */
    public function detail(Request $request, Post $post){
        $post->attachments = $post->attachments()->pluck('path');
        $post->comments->each->parent;
        $post->comments->each->likeEmojis;
        $post->parents = $post->parentsEach();
        return $this->success($post);
    }
    
    /**
     * 查询所属父级菜单
     * @param  Project $project
     * @param  int $id
     * @return mixed
     */
    public function parents(Project $project, int $id){
        $Post = new Post();
        $cascader = $Post->childrenEdit($project->id, 0, $id);
        return $this->success($cascader);
    }
    
    /**
     * @param Request $request
     * @param int $id
     * @return mixed
     */
    public function store(Request $request, int $id){
        $post = $request->validate([
            'pid'       => 'required',
            'project_id'=> 'required|integer|min:1',
            'name'      => 'required',
            'attachments'=> 'array',
            'content'   => '',
            'html'      => '',
            'sort'      => '',
        ]);
        $post['user_id'] = Auth::id();
        $post['status'] = 1;
        $attachments = $post['attachments'] ?? [];
        unset($post['attachments']);
    
        $post_old = Post::firstOrNew(['id' => $id], [
            'content'   => '',
        ]);
        $Post = Post::updateOrCreate(['id' => $id], $post);
    
        // 存入记录
        if($post['content'] && $post_old->content && $post['content'] != $post_old->content){
            PostHistory::create([
                'user_id'   => Auth::id(),
                'post_id'   => $Post->id,
                'content'   => $post_old->content,
            ]);
    
            // 分发日志记录
            if($id > 0){
                event(new PostUpdateEvent($Post));
            }else{
                event(new PostStoreEvent($Post));
            }
        }
        
        // 不在post里面的，肯定是被点击删除了的
        PostAttachment::where(['post_id' => $Post->id])->whereNotIn('path', $attachments)->delete();
        foreach(array_reverse($attachments) as $attachment){
            PostAttachment::updateOrCreate(['post_id' => $Post->id, 'path' => $attachment]);
        }
        
        return $this->success($Post);
    }
    
    /**
     * 导出单个文档为 Word
     * @param Post $post
     * @return array
     */
    public function export(Post $post){
        $Word = new Word();
        $url = $Word->addPost($post)->save($post->name.'.doc');
        return $this->success([
            'fileurl' => $url,
        ]);
    }
    
    /**
     * 排序
     * @param Request $request
     * @param Project $project
     * @return mixed
     */
    public function sort(Request $request, Project $project){
        ['pid'=> $pid, 'index_from' => $index_from, 'index_to' => $index_to] = $request->validate([
            'pid'           => 'required|integer|min:0',
            'index_from'    => 'required|integer|min:0',
            'index_to'      => 'required|integer|min:0',
        ]);
        // 排序需要找到父级下所有，然后依次重新排序
        $Posts = Post::where('pid', $pid)->active()->orderBy('sort')->get();
        $removed = $Posts->splice($index_from, 1);
        $Posts->splice($index_to, 0, $removed->toArray());
        $Posts->each(function($v, $k){
            Post::where('id', $v['id'])->update(['sort' => $k]);
        });
        $Post = new Post();
        $posts = $Post->children($project->id, 0, 'id, pid, user_id, name');
        return $this->success($posts);
    }
    
    /**
     * 删除文档
     * @param Post $post
     * @return mixed
     * @throws \Exception
     */
    public function delete(Post $post){
        $post->histories->each->delete();
        $post->attachments->each->delete();
        $post->comments->each->likes->each->delete();
        $post->comments->each->delete();
        $post->likes->each->delete();
        $post->events->each->delete();
        $post->delete();
        return $this->success();
    }
    
    /**
     * 修改历史
     * @param Post $post
     * @return mixed
     */
    public function history(Post $post){
        $Histories = PostHistory::select('id', 'created_at', 'post_id', 'user_id', 'content')->with(['user'])->where(['post_id' => $post->id])->latest()->limit(50)->get();
        return $this->success($Histories);
    }
    
    /**
     * 使用某一历史还原文档
     * @param PostHistory $postHistory
     * @return mixed
     */
    public function history_restore(PostHistory $postHistory){
        Post::where(['id'=> $postHistory->post_id])->update([
            'content'   => $postHistory->content,
        ]);
        return $this->success();
    }
    
    /**
     * 删除历史
     * @param PostHistory $postHistory
     * @return mixed
     */
    public function history_delete(PostHistory $postHistory){
        $postHistory->delete();
        return $this->success();
    }
    
    /**
     * 文档点赞
     * @param Request $request
     * @param Post $post
     * @return mixed
     */
    public function like(Request $request, Post $post){
        $param = $request->validate([
            'code' => 'required|integer',
            'emoji' => 'required',
        ]);
        $PostLike = PostLike::updateOrCreate([
            'user_id'   => Auth::id(),
            'post_id'   => $post->id,
            'code'      => $param['code'],
        ], [
            'emoji'     => $param['emoji'],
        ]);
        
        // 分发日志记录
//        event(new PostLikeEvent($PostLike));
        $post->likesGroup;
        return $this->success($post);
    }
    
    /**
     * 提交评论
     * @param Request $request
     * @param Post $post
     * @return mixed
     */
    public function comment(Request $request, Post $post){
        if (Cache::has('PostController@comment')) {
            return $this->failed('请求频繁');
        }
        Cache::put('PostController@comment', 1, 5);
        $param = $request->validate([
            'pid'       => 'required|integer|min:0',
            'content'   => 'required',
        ]);
        $param['post_id'] = $post->id;
        $param['user_id'] = Auth::id();
        $PostComment = PostComment::create($param);
        $PostComment->user;
        $PostComment->likeEmojis;
        // 分发日志记录
//        event(new PostCommentEvent($PostComment));
        return $this->success($PostComment);
    }
    
    /**
     * 文档评论点赞
     * @param Request $request
     * @param PostComment $postComment
     * @return mixed
     */
    public function comment_like(Request $request, PostComment $postComment){
        $post = $request->validate([
            'emoji' => 'required',
        ]);
        PostCommentLike::create([
            'user_id'       => Auth::id(),
            'post_comment_id'=> $postComment->id,
            'emoji'         => $post['emoji'],
        ]);
        return $this->success();
    }
    
    /**
     * 删除评论
     *  3 天之内可以删除
     * @param Request     $request
     * @param PostComment $postComment
     * @return mixed
     * @throws \Exception
     */
    public function comment_delete(Request $request, PostComment $postComment){
        if($postComment->user_id != Auth::id()){
            exception('非本人评论，信息错误');
        }
        $seconds = 86400 * 3;
        $diff = now()->diffInSeconds($postComment->created_at);
        if($diff > $seconds){
            exception('已超时，仅可删除三天内评论');
        }
        // 删除 event，暂时用时间查找
        PostEvent::where(['post_id'=> $postComment->post_id, 'user_id'=> Auth::id(), 'created_at'=> $postComment->created_at])->delete();
        $postComment->delete();
        return $this->success();
    }
}
