This is the BACKEND repo. 

Frontend repo at: https://github.com/haagahelia/siba-fe

## Note: The backend needs a .env file in the repo root folder

Here is a sample content for that file. Make sure just non-empty lines ended with Enter: 

```
BE_API_URL_PREFIX=/api
BE_SERVER_PORT=3001
DB_DRIVER_MODULE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=<<YOUR_DB_USERNAME_HERE>>
DB_PASSWORD=<<YOUR_DB_PASSWORD_HERE>>
DB_DATABASE=casedb
DB_DEBUG=true
DB_MULTIPLE_STATEMENTS=true
DB_CONNECTION_POOL_MIN=1
DB_CONNECTION_POOL_MAX=7
```