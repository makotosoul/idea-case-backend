## Using Rest Client plugin in VS Code instead of Postman
Rest Client plugin can be used in VS Code to make requests in the running backend instead of Postman, which is convenient for developers to test apis. 
**At first, install REST Client plugin in VS Code through extensions**
***

### Steps 

1. Create a folder for example request in the root of your backend project 

```shell
 mkdir request
```
***

2. Change your directory to the request folder 

```shell
 cd request
```
***

3. Create a file for example subject.rest **Note: file extention should be .rest**

```shell
 touch subject.rest
``` 
***

4. Now you can write your requests inside the file subject.rest
  You can follow these examples below:<br>
  __Note: You need to seperate each next requests with ### to have more than one request in one file__

**Get all subjects**

```shell
 GET http://localhost:8764/api/subject
 Authorization: Basic <put your token here>
```
***

**Get subject by id**

```shell 
GET http://localhost:8764/api/subject/<put subject id here>
Authorization: Basic <put your token here>
```
***

**Create subject**

```shell
POST http://localhost:8764/api/subject
Authorization: Basic <put your token here>
Content-Type: application/json

{
    "name": "Data structures",
    "groupSize": 25,
    "groupCount": 2,
    "sessionLength": "02:30:00",
    "sessionCount": 2,
    "area": 35,
    "programId": 3030,
    "programName": "Avoin Kampus",
    "spaceTypeId": 5002,
    "spaceTypeName": "Luentoluokka"
}
```
***

**Update subject**

```shell
PUT http://localhost:8764/api/subject
Authorization: Basic <put your token here>
Content-Type: application/json

 {
    "id": 4042,
    "name": "Data structures and algorithm",
    "groupSize": 25,
    "groupCount": 2,
    "sessionLength": "02:30:00",
    "sessionCount": 2,
    "area": 35,
    "programId": 3030,
    "programName": "Avoin Kampus",
    "spaceTypeId": 5002,
    "spaceTypeName": "Luentoluokka"
  }
```
***

**Remove subject**

```shell
DELETE http://localhost:8764/api/subject/<put subject id here>
Authorization: Basic <put your token here>
```
***

For detail info, please visit **[here](https://github.com/Huachao/vscode-restclient)** and **[here](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)**

Enjoy!!






