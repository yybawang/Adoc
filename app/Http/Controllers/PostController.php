<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostEvent;
use App\Models\Project;
use Illuminate\Http\Request;

class PostController extends BaseController
{
    /**
     * 文档主页
     *
     * @param int $project_id
     * @return array
     */
    public function index(int $project_id)
    {
        $Post = new Post();
        $project = Project::find($project_id);
        $posts = $Post->children($project_id);
        $events = PostEvent::where(['project_id' => $project_id])->latest()->limit(20)->get();
        return compact($project, $posts, $events);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = Post::firstOrNew(['id' => $id], [
            'pid'       => 0,
            'project_id'=> 0,
            'name'      => '',
            'content'   => '',
            'sort'      => 0,
            'status'    => 1,
        ]);
        return $data;
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
        $post = $request->validate([
            'pid'           => 'required|integer|min:0',
            'project_id'    => 'required|integer|min:1',
            'name'          => 'required',
            'content'       => 'required',
            'sort'          => 'required|numeric',
            'status'        => 'required|integer|min:0',
        ]);
        $data = Post::updateOrCreate(['id' => $id], $post);
        return $data;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
