<?php

require_once("../db/credentials.php");

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

if ($mysqli->connect_errno) {
  echo 'Error en la conexión';
}

$users[] = [
  'email' => 'danielmarcanodev@gmail.com',
  'full_name' => 'Daniel Marcano',
  'pwd' => 'soyelmejor',
  'birth_date' => '1996-12-19'
];

$users[] = [
  'email' => 'naileth@gmail.com',
  'full_name' => 'Naileth Carrero',
  'pwd' => 'soylamejor',
  'birth_date' => '1976-04-02'
];

$users[] = [
  'email' => 'lafantasma@gmail.com',
  'full_name' => 'Gladys Carrero',
  'pwd' => 'soylamejor',
  'birth_date' => '1960-10-12'
];

function create_users($users) {
  global $mysqli;
  foreach ($users as $key => $user) {
    $email = sanitize_var($user['email']);
    $full_name = sanitize_var($user['full_name']);
    $pwd = password_hash(sanitize_var($user['pwd']), PASSWORD_DEFAULT);
    $birth_date = sanitize_var($user['birth_date']);
    $sql = "INSERT INTO usuarios (email, full_name, pwd, birth_date) VALUES ('{$email}', '{$full_name}', '{$pwd}', '{$birth_date}')";
    $result = $mysqli->query($sql);
    if (!$result) {
      echo nl2br("No se ha podido añadir el usuario número {$key}... \n\n");
    } else {
      echo nl2br("¡Se ha añadido el usuario número {$key}! \n\n");
    }

  }
  $mysqli->close();
}

function sanitize_var($variable) {
  return filter_var($variable, FILTER_SANITIZE_SPECIAL_CHARS);
}

create_users($users);
