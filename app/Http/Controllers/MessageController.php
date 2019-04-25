<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $res = Message::where('user_id', Auth::id())->latest()->pageinate();
        return $res;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $res = Message::where(['id'=> $id, 'user_id' => Auth::id()])->first();
        return $res;
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
        //
    }
    
    /**
     * 标记为已读
     * @param $id
     * @return mixed
     */
    public function read($id){
        $res = Message::where(['id'=> $id, 'user_id' => Auth::id()])->update(['read' => 1]);
        return $res;
    }
    
    /**
     * 某一类消息全部已读
     * @param $type
     * @return mixed
     */
    public function read_all($type){
        $res = Message::where(['user_id' => Auth::id(), 'type' => $type])->update(['read' => 1]);
        return $res;
    }
}
