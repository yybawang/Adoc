<?php

namespace App\Http\Controllers\Api;

use App\Events\PostCommentEvent;
use App\Events\PostLikeEvent;
use App\Events\PostStoreEvent;
use App\Models\Post;
use App\Models\PostComment;
use App\Models\PostCommentLike;
use App\Models\PostHistory;
use App\Models\PostLike;
use App\Models\PostTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class PostController extends BaseController
{
    /**
     * @param int $id
     * @return mixed
     */
    public function detail(int $project_id, int $id){
        $Post = Post::active()->with(['comment', 'comment.likeEmojis'])->firstOrNew(['id' => $id], [
            'pid'       => 0,
            'project_id'=> $project_id,
            'name'      => '',
            'content'   => '',
            'sort'      => 0,
            'status'    => 0,
        ]);
        $Post->comment->each->parent;
        $Parents = $Post->parentsEach();
        $ParentsRoot = collect([
            [
                'id'        => 0,
                'siblings'  => [
                    ['id' => '0', 'name' => '顶级菜单']
                ],
            ]
        ]);
        $Post->parents = $ParentsRoot->merge($Parents);
        return $this->success($Post);
    }
    
    public function children(int $project_id, int $id){
        $res = [];
        $Children = Post::active()->where('id', $id)->firstOrFail();
        $Children->siblings = Post::active()->where('pid', $Children->id)->get();
        if($Children->siblings->isNotEmpty()){
            array_push($res, $Children);
        }
        return $this->success($res);
    }
    
    /**
     * @param Request $request
     * @param int $project_id
     * @param int $id
     * @return mixed
     */
    public function store(Request $request, int $project_id, int $id){
        $post = $request->validate([
            'pid'       => 'required',
            'name'      => 'required',
            'content'   => '',
            'status'    => 'required|integer|min:0',
        ]);
        $post['user_id'] = Auth::id();
        $post['project_id'] = $project_id;
        
        // 存入修改记录
        if($post['content']){
            PostHistory::create([
                'user_id'   => Auth::id(),
                'post_id'   => $id,
                'content'   => $post['content'],
            ]);
        }
        
        $Post = Post::updateOrCreate(['id' => $id], $post);
        
        // 分发日志记录
        event(new PostStoreEvent($Post));
        return $this->success($Post);
    }
    
    /**
     * 修改历史
     * @param int $post_id
     * @return mixed
     */
    public function history(int $post_id){
        $Histories = PostHistory::where(['post_id' => $post_id])->latest()->paginate();
        return $this->success($Histories);
    }
    
    /**
     * 文档点赞
     * @param Request $request
     * @param int $post_id
     * @return mixed
     */
    public function like(Request $request, int $post_id){
        $post = $request->validate([
            'emoji' => 'required',
        ]);
        $PostLike = PostLike::create([
            'user_id'   => Auth::id(),
            'post_id'   => $post_id,
            'emoji'     => $post['emoji'],
        ]);
        
        // 分发日志记录
        event(new PostLikeEvent($PostLike));
        return $this->success($PostLike);
    }
    
    /**
     * 提交评论
     * @param Request $request
     * @param $post_id
     * @return mixed
     */
    public function comment(Request $request, $post_id){
        if (Cache::has('PostController@comment')) {
            return $this->failed('请求频繁');
        }
        Cache::put('PostController@comment', 1, 5);
        $post = $request->validate([
            'pid'       => 'required|integer|min:0',
            'content'   => 'required',
        ]);
        $post['post_id'] = $post_id;
        $post['user_id'] = Auth::id();
        $PostComment = PostComment::create($post);
    
        // 分发日志记录
        event(new PostCommentEvent($PostComment));
        return $this->success($PostComment);
    }
    
    /**
     * 文档评论点赞
     * @param Request $request
     * @param int $comment_id
     * @return mixed
     */
    public function comment_like(Request $request, int $comment_id){
        $post = $request->validate([
            'emoji' => 'required',
        ]);
        PostCommentLike::create([
            'user_id'       => Auth::id(),
            'post_comment_id'=> $comment_id,
            'emoji'         => $post['emoji'],
        ]);
        return $this->success();
    }
}
