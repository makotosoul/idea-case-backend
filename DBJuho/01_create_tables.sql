/* --- CREATE DEPARTMENT --- */
CREATE TABLE IF NOT EXISTS Department (
    id          MEDIUMINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(255)    NOT NULL,

    PRIMARY KEY (id)
);

/* --- CREATE PROGRAM --- */
CREATE TABLE IF NOT EXISTS Program (
    id          MEDIUMINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(255)    NOT NULL,

    PRIMARY KEY (id)
);

/* --- CREATE REQUIREMENT --- */
CREATE TABLE IF NOT EXISTS Requirement (
    id          MEDIUMINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(255)    NOT NULL,

    PRIMARY KEY (id)
);

/* --- CREATE EQUIPMENT --- */
CREATE TABLE IF NOT EXISTS Equipment (
    id          MEDIUMINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(255)    NOT NULL,

    PRIMARY KEY (id)
);
/* --- CREATE SPACE --- */
CREATE TABLE IF NOT EXISTS Space (
    id          MEDIUMINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(255)    NOT NULL,

    PRIMARY KEY (id)
);
/* --- CREATE BUILDING --- */
CREATE TABLE IF NOT EXISTS Building (
    id          MEDIUMINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(255)    NOT NULL,

    PRIMARY KEY (id)
);

/* --- CREATE CAMPUS --- */
CREATE TABLE IF NOT EXISTS Campus (
    id          MEDIUMINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(255)    NOT NULL,

    PRIMARY KEY (id)
);