<?php

require_once('utilities.php');
require_once('conector.php');

// We assemble the event
$event['title'] = isset($_POST['title']) ? add_quotes($_POST['title']) : '';
$event['start_date'] = isset($_POST['start_date']) ? add_quotes($_POST['start_date']) : '';
$allDay = isset($_POST['full_day']) ? $_POST['full_day'] : '';
$event['full_day'] = $allDay == 'false' ? 0 : 1;

if (!$event['full_day']) {
  $event['end_date'] = isset($_POST['end_date']) ? add_quotes($_POST['end_date']) : '';
  $event['start_hour'] = isset($_POST['start_hour']) ? add_quotes($_POST['start_hour']) : '';
  $event['end_hour'] = isset($_POST['end_hour']) ? add_quotes($_POST['end_hour']) : '';
}
// We finish assembling the event

$mysqli = new ConnectDB();
$mysqli_response = $mysqli->initConnection('nextu_calendar');

if ($mysqli_response == 'OK') {

  $event['usuario_id'] = $mysqli->getUserId($_SESSION['username']);

  if($mysqli->createEvent($event)) {
    $response['message'] = 'OK';
  } else {
    $response['message'] = 'error';
    $response['description'] = 'Could not add the new event';
  }


} else {
  $response['message'] = 'error';
  $response['description'] = 'Could not connect to the db';
}

echo json_encode($response);
