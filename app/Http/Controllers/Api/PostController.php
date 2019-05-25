<?php

namespace App\Http\Controllers\Api;

use App\Events\PostCommentEvent;
use App\Events\PostLikeEvent;
use App\Events\PostStoreEvent;
use App\Events\PostUpdateEvent;
use App\Listeners\PostUpdateListener;
use App\Models\Post;
use App\Models\PostComment;
use App\Models\PostCommentLike;
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
    public function parent(Project $project, int $id){
        $pid = Post::where('id', $id)->value('pid') ?? 0;
        $Children = Post::active()->where(['project_id' => $project->id, 'pid' => $pid])->get();
        if($Children->isNotEmpty()){
            $Children = collect([['id' => '', 'pid' => 0, 'name' => '-- 选择 --']])->merge($Children);
//            $Parents = $Parents->push($Children);
        }
        
        return $this->success($Children);
    }
    
    /**
     * 查询下集菜单
     * @param  Project $project
     * @param  int $id
     * @return mixed
     */
    public function children(Project $project, int $id){
        $Children = Post::active()->where(['project_id' => $project->id, 'pid' => $id])->get();
        if($Children->isNotEmpty()){
            $Children = collect([['id' => '', 'pid' => 0, 'name' => '-- 选择 --']])->merge($Children);
//            $Parents = $Parents->push($Children);
        }
        
        return $this->success($Children);
    }
    
    /**
     * @param Request $request
     * @return mixed
     */
    public function store(Request $request){
        $post = $request->validate([
            'pid'       => 'required',
            'project_id'=> 'required|integer|min:1',
            'name'      => 'required',
            'content'   => '',
            'html'      => '',
            'status'    => 'required|integer|min:0',
        ]);
        $post['user_id'] = Auth::id();
        
        $Post = Post::create($post);
    
        // 存入记录
        if($post['content']){
            PostHistory::create([
                'user_id'   => Auth::id(),
                'post_id'   => $Post->id,
                'content'   => $post['content'],
            ]);
        }
        
        // 分发日志记录
        event(new PostStoreEvent($Post));
        return $this->success($Post);
    }
    
    /**
     * 更新文档
     * @param Request $request
     * @param Post    $post
     * @return mixed
     */
    public function update(Request $request, Post $post){
        $param = $request->validate([
            'pid'       => 'required',
            'project_id'=> 'required|integer|min:1',
            'name'      => 'required',
            'content'   => '',
            'html'      => '',
            'status'    => 'required|integer|min:0',
        ]);
    
        $post->update($param);
        
        // 存入修改记录
        if($param['content']){
            PostHistory::create([
                'user_id'   => Auth::id(),
                'post_id'   => $post->id,
                'content'   => $post['content'],
            ]);
        }
    
    
        // 分发日志记录
        event(new PostUpdateEvent($post));
        return $this->success($post);
    }
    
    /**
     * 删除文档
     * @param Post $post
     * @return mixed
     * @throws \Exception
     */
    public function delete(Post $post){
        $post->delete();
        return $this->success();
    }
    
    /**
     * 修改历史
     * @param Post $post
     * @return mixed
     */
    public function history(Post $post){
        $Histories = PostHistory::select('id', 'created_at', 'post_id', 'user_id', 'content')->with(['user'])->where(['post_id' => $post->id])->latest()->get();
        return $this->success($Histories);
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
        $request->validate([
            'emoji' => 'required',
        ]);
        $PostLike = PostLike::create([
            'user_id'   => Auth::id(),
            'post_id'   => $post->id,
            'emoji'     => $post['emoji'],
        ]);
        
        // 分发日志记录
        event(new PostLikeEvent($PostLike));
        return $this->success($PostLike);
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
    
        // 分发日志记录
        event(new PostCommentEvent($PostComment));
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
}
