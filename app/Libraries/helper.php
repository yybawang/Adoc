<?php


function exception($msg, $if = true){
    abort_if($if, 500, $msg);
}

function auth_menu(){
    $res = [];
    $routes = app('routes')->getRoutes();
    foreach($routes as $route){
        if($name = data_get($route, 'action.as')){
            $res[] = $name;
        }
    }
    return $res;
}
