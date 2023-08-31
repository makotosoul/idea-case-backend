Local MariaDB installation and making Siba backend to use it instead of CSC cloud.
==================================================================================

1. Download MariaDB from: <https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.1.2&os=windows&cpu=x86_64&pkg=msi&m=xtom_tal>

2. Install it with default settings.

3. Select username, password and write them down. (Default user is root)

4. Open MySQL Client (MariaDB) from Windows start menu.

5. Enter the password you selected.

6. Create database using command: CREATE DATABASE casedb; (CREATE SCHEMA casedb;)

7. Use database using command: USE casedb;

8. Locate your sql script under your repo folder structure.

9. Use following command in MariaDB/SQL client: SOURCE C:/gitrepos/siba/Siba_be/Database/SQL_Scripts/000__CreateALLdb.sql;

10. Open Siba_be folder with Visual Studio Code.

11. Create .env file.

12. Copy following lines to .env file:

    BE_API_URL_PREFIX=/api

    BE_SERVER_PORT=8764

    DB_DRIVER_MODULE=mysql

    DB_HOST=localhost

    DB_PORT=3306

    DB_USER=#your username here

    DB_PASSWORD=#your password here

    DB_DATABASE=casedb

    DB_DEBUG=true

    DB_MULTIPLE_STATEMENTS=true

    DB_CONNECTION_POOL_MIN=1

    DB_CONNECTION_POOL_MAX=7

    SECRET_TOKEN=ThwvTz7KcvxbPeJWxMSU8BBX4

13. Change DB_USER and DB_PASSWORD to the ones you selected.

14. Open Git Bash in Siba_be folder.

15. Run following command in Git Bash: npm start

16. Test that backend is working with following link: <http://localhost:8764/api/subject/getAll>