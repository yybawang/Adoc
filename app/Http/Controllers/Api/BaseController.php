<?php


namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Responses\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BaseController extends Controller
{
    use JsonResponse;
    
    /**
     * markdown 单独上传配置
     * @param Request $request
     * @return array
     */
    public function upload(Request $request){
        $allFile = $request->allFiles();
        $files = [];
        foreach($allFile as $name => $file){
            $path = $file->storeAs('files/'.date('Ymd').'/'.date('Hi'), $file->getClientOriginalName());
            $files[$name] = Storage::url($path);
        }
        return $this->success($files);
    }
}
