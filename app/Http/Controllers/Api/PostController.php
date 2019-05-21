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
    public function detail(Request $request, int $id){
        $project_id = $request->input('project_id');
        $Post = Post::active()->with(['comment', 'comment.likeEmojis'])->firstOrNew(['id' => $id], [
            'pid'       => 0,
            'project_id'=> 0,
            'name'      => '',
            'content'   => '',
            'sort'      => 0,
            'status'    => 1,
        ]);
        $Post->comment->each->parent;
        $Parents = $Post->parentsEach();
        if($Parents->isNotEmpty()){
            $Post->parents = $Parents;
        }else{
            $Post->parents = [[
                'id'    => 0,
                'pid'   => 0,
                'name'  => '-- 选择 --',
                'siblings' => collect([[
                    'id'    => 0,
                    'pid'    => 0,
                    'name'  => '-- 选择 --',
                ]])->merge(Post::where(['project_id' => $project_id, 'pid' => 0])->active()->get()),
            ]];
        }
        
        return $this->success($Post);
    }
    
    public function children(int $id){
        $res = [];
        $Children = Post::active()->where('id', $id)->firstOrFail();
        $Children->siblings = Post::active()->where('pid', $Children->id)->get();
        if($Children->siblings->isNotEmpty()){
            $Children->siblings = collect([['id' => 0, 'pid' => 0, 'name' => '-- 选择 --']])->merge($Children->siblings);
            array_push($res, $Children);
        }
        return $this->success($res);
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
            'content'   => '',
            'status'    => 'required|integer|min:0',
        ]);
        $post['user_id'] = Auth::id();
        
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
     * @param int $id
     * @return mixed
     */
    public function history(int $id){
        $Histories = PostHistory::where(['post_id' => $id])->latest()->paginate();
        return $this->success($Histories);
    }
    
    /**
     * 文档点赞
     * @param Request $request
     * @param int $id
     * @return mixed
     */
    public function like(Request $request, int $id){
        $post = $request->validate([
            'emoji' => 'required',
        ]);
        $PostLike = PostLike::create([
            'user_id'   => Auth::id(),
            'post_id'   => $id,
            'emoji'     => $post['emoji'],
        ]);
        
        // 分发日志记录
        event(new PostLikeEvent($PostLike));
        return $this->success($PostLike);
    }
    
    /**
     * 提交评论
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function comment(Request $request, $id){
        if (Cache::has('PostController@comment')) {
            return $this->failed('请求频繁');
        }
        Cache::put('PostController@comment', 1, 5);
        $post = $request->validate([
            'pid'       => 'required|integer|min:0',
            'content'   => 'required',
        ]);
        $post['post_id'] = $id;
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
