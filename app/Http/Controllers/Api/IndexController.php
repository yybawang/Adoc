<?php


namespace App\Http\Controllers\Api;


use App\Models\Post;
use App\Models\PostEvent;
use App\Models\Project;
use App\Models\ProjectPermission;
use App\Models\ProjectTop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IndexController extends BaseController
{
    /**
     * 主页，展示文档项目列表
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request){
        $uid = Auth::guard('api')->id();
        $list = Project::as('p')->selectRaw('p.*')
            ->leftJoinSub(ProjectPermission::select('id', 'user_id', 'project_id'), 'pp', function($join) use ($uid){
                $join->on('pp.project_id', '=', 'p.id')->where('pp.user_id', '=', $uid);
            })
            ->leftJoinSub(ProjectTop::select('created_at', 'user_id', 'project_id'), 'pt', function($join) use ($uid){
                $join->on('pt.project_id', '=', 'p.id')->where('pt.user_id', '=', $uid);
            })
            // 所属人是自己，或是开放项目，或有权限的
            ->where(function($query) use ($uid){
                $query->where(['p.user_id' => $uid])->orWhere(['p.type' => 0])->orWhereNotNull('pp.id');
            })
            ->orderByDesc('pt.created_at')
            ->orderBy('p.id')
            ->with(['tags'])
            ->get();
    
        return $this->success($list);
    }
    
    /**
     * 项目文档列表、文档日志
     * @param int $id
     * @return array
     */
    public function project(int $id){
        $Post = new Post();
        $project = Project::find($id);
        $posts = $Post->children($id, 0, 'id, pid, user_id, name');
        $events = PostEvent::where(['project_id' => $id])->with(['user', 'post'])->latest()->limit(20)->get()->each->parse();
        $res = [
            'project'   => $project,
            'posts'     => $posts,
            'events'    => $events,
        ];
        return $this->success($res);
    }
    
    /**
     * 文档内容
     * @param int $id
     * @return Post
     */
    public function post(int $id){
        $Post = Post::active()->with(['comment', 'comment.likeEmojis', 'likes'])->where('id', $id)->firstOrFail();
        $Post->comment->each->parent;
        $Post->views += 1;
        $Post->save();
        return $this->success($Post);
    }
    
    /**
     * markdown 单独上传配置
     * @param Request $request
     * @return array
     */
    public function upload_md(Request $request){
        $allFile = $request->allFiles();
        $files = [];
        collect($allFile)->each(function($v,$k) use ($request,&$files){
            $path = $v->store('files');
            $files[$k] = \Illuminate\Support\Facades\Storage::url($path);
        });
        return [
            'success'   => 1,
            'message'   => 'OK',
            'url'       => array_shift($files)
        ];
    }
    
    public function menu(){
        return $this->success();
    }
}
