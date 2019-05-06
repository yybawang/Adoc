<?php
/**
 * 编辑项目
 */
namespace App\Http\Controllers\Api;

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
    public function detail(int $id){
        $Project = Project::firstOrNew(['id' => $id], [
            'name'  => '',
            'type'  => 0,
            'description' => '',
            'tags'  => [],
        ]);
        return $this->success($Project);
    }
    
    public function store(Request $request, int $id){
        $post = $request->validate([
            'name'  => 'required',
            'type'  => 'required|integer|min:0',
            'description' => '',
        ]);
        $post['user_id'] = Auth::id();
        $tags = $request->input('tags') ?? [];
        if(empty($id) && Project::where(['user_id' => $post['user_id'], 'name' => $post['name']])->exists()){
            exception(__('该项目名已存在'));
        }
        $Project = Project::updateOrCreate(['id' => $id], $post);
        // 本来数据中有，而新传递没有的就是要删除的
        ProjectTag::where('project_id', $Project->id)->whereNotIn('name', $tags)->delete();
        foreach($tags as $tag){
            ProjectTag::updateOrCreate([
                'project_id'=> $Project->id,
                'name'      => $tag,
            ]);
        }
        return $this->success($Project);
    }
    
    /**
     * 项目所有权转让
     * @param Request $request
     * @param int $id
     * @return mixed
     */
    public function transfer(Request $request, int $id){
        $post = $request->validate([
            'to_user_id'   => 'required|integer|min:1',        //  要转让的用户ID
        ]);
        Project::where(['id' => $id])->update(['user_id' => $post['to_user_id']]);
        return $this->success();
    }
    
    /**
     * 项目删除
     * 1、删除评论相关数据
     * 2、删除文章相关数据
     * 3、删除操作相关日志
     * 3、删除项目
     * @param $id
     * @return mixed
     */
    public function destroy($id){
        $Project = Project::find($id);
        $Project->tags->each->delete();                                     // 删除tag
        $Project->permissions->each->delete();                              // 删除权限配置
        $Project->posts->each->attachments->each->delete();                 // 删除文档附件
        $Project->posts->each->history->each->delete();                     // 删除文档历史
        $Project->posts->each->likes->each->delete();                       // 删除文档点赞
        $Project->posts->each->comment->each->likes->each->delete();        // 删除文档留言点赞
        $Project->posts->each->comment->each->delete();                     // 删除文档留言
        $Project->events->each->delete();                                   // 删除操作日志
        $Project->templates->each->delete();                                // 删除文档模版
        $Project->tops->each->delete();                                     // 删除项目置顶
        $Project->delete();
        return $this->success();
    }
    
    /**
     * 项目权限列表
     * 未分页
     * @param Request $request
     * @param int $project_id
     * @return mixed
     */
    public function permission(int $project_id){
        $Permissions = ProjectPermission::where(['project_id' => $project_id])->get();
        return $Permissions;
    }
    
    /**
     * 关键词检索用户
     * @param string $keyword
     * @return mixed
     */
    public function permission_user(string $keyword){
        $Users = User::select('id', 'name', 'email')->where(function($query) use ($keyword){
            $query->where('name', 'like', $keyword.'%')->orWhere('email', 'like', $keyword.'%');
        })->limit(20)->get();
        return $this->success($Users);
    }
    
    /**
     * 权限编辑
     * @param Request $request
     * @param int $project_id
     * @return mixed
     */
    public function permission_store(Request $request, int $project_id){
        $post = $request->validate([
            'user_id'   => 'required|integer|min:1',
            'write'     => 'required|integer|min:0|max:1',
            'admin'     => 'required|integer|min:0|max:1',
        ]);
        // 操作人
        $post['admin_id'] = Auth::id();
        $Permission = ProjectPermission::updateOrCreate(['project_id' => $project_id, 'user_id' => $post['user_id']], $post);
        return $this->success($Permission);
    }
    
    /**
     * @param int $project_id
     * @return mixed
     */
    public function template(int $project_id){
        $Templates = PostTemplate::where(['project_id' => $project_id])->get();
        return $this->success($Templates);
    }
    
    /**
     * @param Request $request
     * @param int $project_id
     * @return mixed
     */
    public function template_store(Request $request, int $project_id){
        $post = $request->validate([
            'name'      => 'required',
            'content'   => 'required',
        ]);
        $post['user_id'] = Auth::id();
        $Template = PostTemplate::updateOrCreate(['project_id' => $project_id, 'name' => $post['name']]);
        return $this->success($Template);
    }
}
