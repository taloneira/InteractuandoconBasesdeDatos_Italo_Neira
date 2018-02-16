<?php

session_start();

function add_quotes($str) {
    return sprintf("'%s'", $str);
}
