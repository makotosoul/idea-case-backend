/* --- CREATE DEPARTMENT --- */
CREATE TABLE IF NOT EXISTS Department (
    id          INTEGER       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(16000)    NOT NULL,

    PRIMARY KEY (id)
);

/* --- CREATE PROGRAM --- */
CREATE TABLE IF NOT EXISTS Program (
    id          INTEGER       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(16000)    NOT NULL,

    PRIMARY KEY (id)
);

/* --- CREATE REQUIREMENT --- */
CREATE TABLE IF NOT EXISTS Requirement (
    id          INTEGER       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(16000)    NOT NULL,

    PRIMARY KEY (id)
);

/* --- CREATE EQUIPMENT --- */
CREATE TABLE IF NOT EXISTS Equipment (
    id          INTEGER       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(16000)    NOT NULL,

    PRIMARY KEY (id)
);
/* --- CREATE SPACE --- */
CREATE TABLE IF NOT EXISTS ´Space´ (
    id          INTEGER       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(16000)    NOT NULL,

    PRIMARY KEY (id)
);
/* --- CREATE BUILDING --- */
CREATE TABLE IF NOT EXISTS Building (
    id          INTEGER       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(16000)    NOT NULL,

    PRIMARY KEY (id)
);

/* --- CREATE CAMPUS --- */
CREATE TABLE IF NOT EXISTS Campus (
    id          INTEGER       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(16000)    NOT NULL,

    PRIMARY KEY (id)
);