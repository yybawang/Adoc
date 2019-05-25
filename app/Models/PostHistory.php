<?php

namespace App\Models;

class PostHistory extends Model
{
    public function user(){
        return $this->belongsTo(User::class);
    }
}
