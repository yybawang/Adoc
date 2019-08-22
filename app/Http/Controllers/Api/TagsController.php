<?php

namespace App\Http\Controllers\Api;

use App\Models\ProjectTag;
use Illuminate\Http\Request;

/**
 * 标签管理
 * Class TagsController
 *
 * @package App\Http\Controllers\Api
 */
class TagsController extends BaseController
{
    public function index(Request $request){
        $Tags = ProjectTag::all();
        return $this->success($Tags);
    }
    
    public function store(Request $request){
        $param = $request->validate([
            'name'  => 'required',
        ]);
        
        $Tag = ProjectTag::updateOrCreate(['name' => $param['name']]);
        return $this->success($Tag);
    }
    
    public function delete(int $id){
        ProjectTag::destroy($id);
        return $this->success();
    }
}
