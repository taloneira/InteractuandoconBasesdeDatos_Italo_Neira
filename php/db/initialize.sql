CREATE DATABASE nextu_calendar;

USE nextu_calendar;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(50) NOT NULL,
  pwd VARCHAR(80) NOT NULL,
  birth_date DATE NOT NULL
);

CREATE TABLE eventos (
  id SERIAL PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  CONSTRAINT fk_evento_usuario
     FOREIGN KEY (usuario_id)
     REFERENCES usuarios (id),
  title VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  start_hour TIME,
  end_date DATE,
  end_hour TIME,
  full_day BOOLEAN NOT NULL
);
