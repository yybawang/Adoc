<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Model extends Eloquent
{
    protected $guarded = [];
    
    protected $perPage = 20;
    
    /**
     * 模型别名
     * @param $query
     * @param string $as
     * @return mixed
     */
    public function scopeAs($query, string $as){
        return $query->from($this->getTable() . ' as ' . $as);
    }
}
