<?php
require_once('utilities.php');

require_once('conector.php');

if (isset($_SESSION['username'])) {

  $username = $_SESSION['username'];

  $mysqli = new ConnectDB();
  $mysqli_response = $mysqli->initConnection('nextu_calendar');

  if ($mysqli_response == 'OK') {

    $user = $mysqli->getUser($username);

    if (isset($user['email'])) {
      $response['message'] = 'OK';
    } else {
      $response['message'] = 'error';
      $response['description'] = 'User not found';
    }
  } else {
    $response['message'] = 'error';
    $response['description'] = 'Could not connect to the db';
  }

} else {
  $response['message'] = 'error';
  $response['description'] = 'You need to login first';
}

echo json_encode($response);
