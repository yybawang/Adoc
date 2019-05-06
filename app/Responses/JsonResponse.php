<?php


namespace App\Responses;

use Illuminate\Http\Response;

trait JsonResponse
{
    protected $statusCode = Response::HTTP_OK;
    
    // json 返回固定三要素
    protected $code = 0;
    protected $message = '';
    protected $data = [];
    
    public function getStatusCode(){
        return $this->statusCode;
    }
    
    public function setStatusCode($status_code){
        $this->statusCode = $status_code;
        return $this;
    }
    
    public function getCode(){
        return $this->code;
    }
    
    public function setCode(int $code){
        $this->code = $code;
        return $this;
    }
    
    public function getMessage(){
        return $this->message;
    }
    
    public function setMessage($message){
        $this->message = $message;
        return $this;
    }
    
    public function getData(){
        return $this->data;
    }
    
    public function setData($data){
        $this->data = $data;
        return $this;
    }
    
    /**
     * 返回成功的结果
     * @param array $data
     * @param string $message
     * @return mixed
     */
    public function success($data = [], $message = 'success'){
        return $this->setCode(0)->setMessage($message)->setData($data)->setStatusCode(Response::HTTP_OK)->respond();
    }
    
    /**
     * 返回失败的结果
     * @param string $message
     * @return mixed
     */
    public function failed($message = 'failed'){
        return $this->setCode(1)->setMessage($message)->setData([])->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR)->respond();
    }
    
    public function respond(){
        $Response = \response();
        return $Response->json([
            'code'      => $this->getCode(),
            'message'   => $this->getMessage(),
            'data'      => $this->getData(),
        ], $this->getStatusCode());
    }
}
