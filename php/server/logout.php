<?php
require('utilities.php');

$_SESSION = [];
session_destroy();
$response['message'] = 'You have logged out';

echo json_encode($response);
