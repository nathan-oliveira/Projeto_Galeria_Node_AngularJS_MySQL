CREATE SCHEMA db_galeria;

CREATE TABLE db_galeria.galeria (
  id_galeria INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(255) NULL,
  caminho TEXT NULL,
  PRIMARY KEY(id_galeria)
);