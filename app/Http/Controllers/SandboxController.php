<?php
namespace App\Http\Controllers;

use Illuminate\Support\Str;

class SandboxController extends Controller {
    public function test(){
        $s = Str::plural('response');
        dd($s);
    }
}
