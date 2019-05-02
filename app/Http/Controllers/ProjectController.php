<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectPermission;
use App\Models\ProjectTop;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ProjectController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $uid = Auth::id();
        $list = Project::as('p')->selectRaw('p.*')
            ->leftJoinSub(ProjectPermission::select('id', 'user_id', 'project_id'), 'pp', function($join) use ($uid){
                $join->on('pp.project_id', '=', 'p.id')->where('pp.user_id', '=', $uid);
            })
            ->leftJoinSub(ProjectTop::select('created_at', 'user_id', 'project_id'), 'pt', function($join) use ($uid){
                $join->on('pt.project_id', '=', 'p.id')->where('pt.user_id', '=', $uid);
            })
            // 所属人是自己，或者是开放项目，或者有权限的
            ->where(function($query) use ($uid){
                $query->where(['p.user_id' => $uid])->orWhere(['p.type' => 0])->orWhereNotNull('pp.id');
            })
            ->orderByDesc('pt.created_at')
            ->orderBy('p.id')
            ->with(['tags'])
            ->get();
            
        return $list;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $this->auth_check();
        $data = Project::firstOrNew(['id' => $id], [
            'name'  => '',
            'type'  => 0,
            'description' => '',
        ]);
        return $data;
    }
    
    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, int $id)
    {
        $this->auth_check();
        $post = $request->validate([
            'id'    => '',
            'name'  => 'required|string',
            'type'  => 'required|integer',
            'description' => '',
        ]);
        $uid = Auth::id();
        $post['user_id'] = $uid;
        // 查找是否已存在
        if(Project::where(['user_id'=> $uid, 'name' => $post['name']])->count()){
            exception(__('该项目名已存在'));
        }
        $data = Project::updateOrCreate(['id' => $id], $post);
        return $data;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return array
     */
    public function destroy(int $id)
    {
        $this->auth_check();
        Project::destroy($id);
        return [];
    }
}
