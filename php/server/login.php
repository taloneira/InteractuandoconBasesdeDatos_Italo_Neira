<?php

require_once('utilities.php');
require_once("conector.php");

function is_set($variable) {
  return isset($_POST[$variable]) ? $_POST[$variable] : '';
}

$username = isset($_POST['username']) ? $_POST['username'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

$mysqli = new ConnectDB();
$mysqli_response = $mysqli->initConnection('nextu_calendar');

if ($mysqli_response == 'OK') {
  $user = $mysqli->getUser($username);

  if ($user) {

    if (password_verify($password, $user['pwd'])) {
      $_SESSION['username'] = $user['email'];
      $response['message'] = 'OK';
    } else {
      $response['message'] = 'error';
      $response['description'] = 'Incorrect email or password';
    }

  } else {
    $response['message'] = 'error';
    $response['description'] = 'Could not find the user';
  }

} else {
  $response['message'] = 'error';
  $response['description'] = 'Could not connect to the db';
}


echo json_encode($response);
