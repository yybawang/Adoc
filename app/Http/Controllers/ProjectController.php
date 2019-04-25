<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ProjectController extends HomeController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $uid = Auth::id();
        $list = Project::as('p')->select('p.id', 'p.user_id', 'p.name', 'p.type', 'p.flower', 'p.description', 'pp.write', 'pp.admin')
            ->leftJoin('project_permissions as pp', 'pp.project_id', '=', 'p.id')
            ->where(['p.user_id' => $uid])
            ->orWhere(['pp.user_id' => $uid])
            ->orderByDesc('p.flower')
            ->orderByDesc('p.id')
            ->get();
        return Response::json($list);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $post = $request->validate([
            'id'    => '',
            'name'  => 'required|string',
            'type'  => 'required|integer',
            'flower'=> 'integer',
            'description' => '',
        ]);
        $uid = Auth::id();
        $post['user_id'] = $uid;
        $data = Project::updateOrCreate(['id' => $post['id']], $post);
        return Response::json($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = Project::firstOrNew(['id' => $id], [
            'name'  => '',
            'type'  => 0,
            'flower'=> 0,
            'description' => '',
        ]);
        return Response::json($data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $res = Project::destroy($id);
        return Response::json($res);
    }
}
