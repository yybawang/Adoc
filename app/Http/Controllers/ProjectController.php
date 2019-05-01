<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectPermission;
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
        $list = collect();
        ProjectPermission::where(['user_id' => $uid])
            ->orderByDesc('flower_at')
            ->orderBy('id')
            ->with(['project', 'project.tags'])
            ->get()
            ->each(function($v) use ($list){
                $list->push($v);
            });
            
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
        Auth::check();
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
        // 添加权限
        ProjectPermission::updateOrCreate(['user_id' => $uid, 'project_id' => $data->id], [
            'write' => 1,
            'admin' => 1,
        ]);
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
        Auth::check();
        Project::destroy($id);
        return [];
    }
}
