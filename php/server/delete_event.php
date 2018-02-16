<?php

require_once('utilities.php');
require_once('conector.php');

$event_id = isset($_POST['event_id']) ? $_POST['event_id'] : '';
$username = $_SESSION['username'];

$mysqli = new ConnectDB();
$mysqli_response = $mysqli->initConnection('nextu_calendar');

if ($mysqli_response == 'OK') {

  $user_id = $mysqli->getUserId($username);

  if($mysqli->deleteEvent($event_id, $user_id)) {
    $response['message'] = 'OK';
  } else {
    $response['message'] = 'error';
    $response['description'] = 'Could not delete the event...';
  }
} else {
  $response['message'] = 'error';
  $response['description'] = 'Could not connect to the DB';
}

echo json_encode($response);
