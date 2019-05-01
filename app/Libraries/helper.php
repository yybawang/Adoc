<?php


function exception($msg, $if = true){
    abort_if($if, 500, $msg);
}
