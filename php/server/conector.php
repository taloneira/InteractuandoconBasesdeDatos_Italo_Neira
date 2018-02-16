<?php

require_once("../db/credentials.php");

class ConnectDB {
  private $host;
  private $user;
  private $password;
  private $connection;

  function __construct($host = DB_HOST, $user = DB_USER, $password = DB_PASSWORD) {
    $this->host = $host;
    $this->user = $user;
    $this->password = $password;
  }

  private function run_query($query) {
    return $this->connection->query($query);
  }

  function initConnection($nombre_db) {
    $this->connection = new mysqli($this->host, $this->user, $this->password, $nombre_db);
    if ($this->connection->connect_error) {
      return "Error:" . $this->connection->connect_error;
    }else {
      return "OK";
    }
  }

  function getConexion() {
    return $this->connection;
  }

  function closeConnection() {
    $this->connection->close();
  }

  function createEvent($event) {

    $event_keys = array_keys($event);
    $event_keys = implode(', ', $event_keys);

    $event_values = implode(', ', $event);

    $sql = "INSERT INTO eventos ({$event_keys}) VALUES ({$event_values})";

    return $this->run_query($sql);
  }

  function findEvents($username) {
    $sql = "SELECT
    e.id,
    e.title,
    e.start_date,
    e.start_hour,
    e.end_date,
    e.end_hour,
    e.full_day
    FROM eventos AS e LEFT JOIN usuarios AS u ON e.usuario_id = u.id WHERE (u.email = '{$username}');";

    $events = $this->run_query($sql);

    if ($events->num_rows > 0) {
      $edited_events = $this->prepareEvents($events);
      return $edited_events;
    } else {
      return false;
    }
  }

  function prepareEvents($events) {

    $edited_events = [];

    while($event = $events->fetch_assoc()) {
      $edited_event['id'] = $event['id'];
      $edited_event['title'] = $event['title'];
      $edited_event['fullDay'] = $event['full_day'] > 0 ? true : false;

      if ($edited_event['fullDay']) {
        $start_date = $event['start_date'];
        $edited_event['start'] = date('Y-m-d', strtotime($start_date));
      } else {
        $start_date = $event['start_date'];
        $start_hour = $event['start_hour'];
        $edited_event['start'] = date('Y-m-d H:i:s', strtotime($start_date . ' ' . $start_hour));

        $end_date = $event['end_date'];
        $end_hour = $event['end_hour'];
        $edited_event['end'] = date('Y-m-d H:i:s', strtotime($end_date . ' ' . $end_hour));
      }

      $edited_events[] = $edited_event;
    }

    return $edited_events;
  }

  function updateEvent($event) {

    $event_values = [];

    foreach ($event as $key => $value) {
      if ($key != 'id' && $key != 'usuario_id') {

        if (is_null($value)) {
          $event_values[] = $key . ' = NULL';
        } else {
          $event_values[] = $key . ' = ' . $value;
        }
      }
    }

    settype($event['id'], 'int');
    settype($event['usuario_id'], 'int');

    $event_values = implode(', ', $event_values);

    $sql = "UPDATE eventos SET {$event_values} WHERE usuario_id = {$event['usuario_id']} AND id = {$event['id']}";

    return $this->run_query($sql);
  }

  function deleteEvent($event_id, $user_id) {
    settype($event_id, 'int');
    settype($user_id, 'int');
    $sql = "DELETE FROM eventos WHERE id = {$event_id} AND usuario_id = {$user_id} LIMIT 1";
    return $this->run_query($sql);
  }

  function getUserId($username) {
    $sql = "SELECT id FROM usuarios AS u WHERE u.email = '{$username}'";
    $user = $this->run_query($sql);
    if ($user->num_rows) {
      $user = $user->fetch_assoc();
      return $user['id'];
    } else {
      return false;
    }
  }

  function getUser($username) {
    $sql = "SELECT * FROM usuarios AS u WHERE u.email = '{$username}'";
    $response = $this->run_query($sql);
    if ($response->num_rows) {
      return $response->fetch_assoc();
    } else {
      return false;
    }
  }

}
