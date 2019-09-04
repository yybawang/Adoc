<?php
/**
 * 编辑项目
 */
namespace App\Http\Controllers\Api;

use App\Libraries\Word;
use App\Models\Post;
use App\Models\PostTemplate;
use App\Models\Project;
use App\Models\ProjectPermission;
use App\Models\ProjectTag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends BaseController
{
    /**
     * 项目详情
     * @param Project $project
     * @return mixed
     */
    public function detail(Project $project){
        return $this->success($project);
    }
    
    /**
     * 项目新增
     * @param Request $request
     * @return mixed
     */
    public function store(Request $request){
        $post = $request->validate([
            'name'      => 'required',
            'type'      => 'required|integer|min:0',
            'description'=> '',
            'tags'      => 'array'
        ]);
        $post['user_id'] = Auth::id();
        if(Project::where(['user_id' => $post['user_id'], 'name' => $post['name']])->exists()){
            exception('该项目名已存在');
        }
        $Project = Project::create($post);
        
        if(!empty($post['tags'])){
            // 本来数据中有，而新传递没有的就是要删除的
            foreach($post['tags'] as $tag){
                ProjectTag::create([
                    'project_id'=> $Project->id,
                    'name'      => $tag,
                ]);
            }
        }
        return $this->success($Project);
    }
    
    /**
     * 项目修改
     * @param Request $request
     * @param Project $project
     * @return mixed
     */
    public function update(Request $request, Project $project){
        $post = $request->validate([
            'name'      => 'required',
            'type'      => 'required|integer|min:0',
            'description'=> '',
            'tags'      => 'array',
        ]);
        $tags = $post['tags'] ?? [];
        unset($post['tags']);
        $post['user_id'] = Auth::id();
        $project->update($post);
        
        // 本来数据中有，而新传递没有的就是要删除的
        ProjectTag::where('project_id', $project->id)->whereNotIn('name', $tags)->delete();
        foreach($tags as $tag){
            ProjectTag::updateOrCreate([
                'project_id'=> $project->id,
                'name'      => $tag,
            ]);
        }
        
        return $this->success($project);
    }
    
    /**
     * 搜索项目下文档
     * @param Request $request
     * @param int $id
     * @return mixed
     */
    public function search(Request $request, int $id){
        $keyword = $request->input('keyword');
        $Posts = Post::where('project_id', $id)->where(function($query) use ($keyword){
            $query->where('name', 'like', "%{$keyword}%")->orWhere('content', 'like', "%{$keyword}%");
        })->limit(10)->get();
        return $this->success($Posts);
    }
    
    /**
     * 项目所有权转让
     * @param Request $request
     * @param Project $project
     * @return mixed
     */
    public function transfer(Request $request, Project $project){
        $post = $request->validate([
            'email'   => 'required|email',        //  要转让的用户邮箱
        ]);
        // 自己不用转让，没有权限不能转让
        $User = User::where('email', $post['email'])->firstOrFail();
        if($User->id == $project->user_id){
            exception('该项目归属者已经是所填接收者');
        }
        $project->update(['user_id' => $User->id]);
        return $this->success();
    }
    
    public function export(Project $project, int $pid){
        $Word = new Word();
        $Post = new Post();
        $posts = $Post->children($project->id, $pid, 'id, name, html');
        $this->_export($posts, $Word);
        $url = $Word->save(($pid ? Post::where('id', $pid)->value('name') : $project->name).'.doc');
        return $this->success([
            'fileurl' => $url,
        ]);
    }
    
    private function _export($list, Word $Word){
        foreach ($list as $v){
            if($v->children->isNotEmpty()){
                $this->_export($v->children, $Word);
            }else{
                $Word->addPost($v);
            }
        }
    }
    
    /**
     * 项目删除
     * 1、删除评论相关数据
     * 2、删除文章相关数据
     * 3、删除操作相关日志
     * 3、删除项目
     * @param Project $project
     * @return mixed
     */
    public function destroy(Project $project){
        $project->tags->each->delete();                                     // 删除tag
        $project->permissions->each->delete();                              // 删除权限配置
        $project->posts->each->attachments->each->delete();                 // 删除文档附件
        $project->posts->each->history->each->delete();                     // 删除文档历史
        $project->posts->each->likes->each->delete();                       // 删除文档点赞
        $project->posts->each->comment->each->likes->each->delete();        // 删除文档留言点赞
        $project->posts->each->comment->each->delete();                     // 删除文档留言
        $project->events->each->delete();                                   // 删除操作日志
        $project->templates->each->delete();                                // 删除文档模版
        $project->tops->each->delete();                                     // 删除项目置顶
        $project->delete();
        return $this->success();
    }
    
    /**
     * 项目权限列表
     * 未分页
     * @param Project $project
     * @return mixed
     */
    public function permission(Project $project){
        $Permissions = ProjectPermission::where(['project_id' => $project->id])->with(['user'])->get();
        return $this->success($Permissions);
    }
    
    /**
     * 关键词检索用户
     * @param string $keyword
     * @return mixed
     */
    public function permission_user(Request $request, Project $project, string $keyword){
        if(strlen($keyword) < 3){
            exception('关键字最少为 3 个字符');
        }
        $Users = User::select('id', 'name', 'email')->where('id', '!=', Auth::id())->where(function($query) use ($keyword){
            $query->where('name', 'like', $keyword.'%')->orWhere('email', 'like', $keyword.'%');
        })->limit(20)->get();
        return $this->success($Users);
    }
    
    /**
     * 权限编辑
     * @param Request $request
     * @param Project $project
     * @return mixed
     */
    public function permission_store(Request $request, Project $project){
        $post = $request->validate([
            'user_id'   => 'required|integer|min:1',
            'write'     => 'required|boolean',
            'admin'     => 'required|boolean',
        ]);
        // 操作人
        $post['admin_id'] = Auth::id();
        
        $Permission = ProjectPermission::updateOrCreate(['project_id' => $project->id, 'user_id' => $post['user_id']], $post);
        return $this->success($Permission);
    }
    
    /**
     * 删除某一用户权限
     * @param Request $request
     * @param ProjectPermission $projectPermission
     * @return mixed
     */
    public function permission_delete(Request $request, ProjectPermission $projectPermission){
        $projectPermission->delete();
        return $this->success();
    }
    
    /**
     * @param Project $project
     * @return mixed
     */
    public function template(Project $project){
        $Templates = PostTemplate::where(['project_id' => $project->id])->orWhere('global', 1)->latest()->get();
        return $this->success($Templates);
    }
    
    /**
     * @param Request $request
     * @param Project $project
     * @return mixed
     */
    public function template_store(Request $request, Project $project){
        $post = $request->validate([
            'name'      => 'required',
            'global'    => 'required|integer',
            'content'   => 'required',
        ]);
        $post['user_id'] = Auth::id();
        $Template = PostTemplate::create([
            'project_id'    => $project->id,
            'name'          => $post['name'],
            'content'       => $post['content'],
            'global'        => $post['global'],
            ]);
        return $this->success($Template);
    }
    
    /**
     * @param Request $request
     * @param PostTemplate $postTemplate
     * @return mixed
     */
    public function template_delete(Request $request, PostTemplate $postTemplate){
        $postTemplate->delete();
        return $this->success();
    }
}
