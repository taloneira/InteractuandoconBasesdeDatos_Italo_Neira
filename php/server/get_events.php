<?php

  require_once('utilities.php');
  require_once('conector.php');

  $username = $_SESSION['username'];

  $mysqli = new ConnectDB();
  $mysqli_response = $mysqli->initConnection('nextu_calendar');

  if ($mysqli_response) {
    $events = $mysqli->findEvents($username);
    if ($events) {
      $response['events'] = $events;
      $response['message'] = 'OK';
    } else {
      $response['message'] = 'OK';
      $response['description'] = 'Could not retrieve the events, or this user has no events...';
    }
  } else {
    $response['message'] = 'error';
    $response['description'] = 'Could not connect to the db';
  }


// echo json_encode($response['events']);
echo json_encode($response);
