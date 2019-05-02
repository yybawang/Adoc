<?php
/**
 * 编辑项目
 */
namespace App\Http\Controllers\Api;

use App\Models\Post;
use App\Models\Project;
use App\Models\ProjectPermission;
use App\Models\ProjectTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends BaseController
{
    public function detail(Request $request, int $id){
        $Project = Project::firstOrNew(['id' => $id], [
            'name'  => '',
            'type'  => 0,
            'description' => '',
            'tags'  => [],
        ]);
        return $Project;
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
        return $Project;
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
        $Project->tops->each->delete();                                // 删除项目置顶
        $Project->delete();
        return $id;
    }
    
    /**
     * 项目权限列表
     * 未分页
     * @param Request $request
     * @param int $project_id
     * @return mixed
     */
    public function permission(Request $request, int $project_id){
        $Permissions = ProjectPermission::where(['project_id' => $project_id])->get();
        return $Permissions;
    }
}
