# fancy-todo
MyTodo
===

USAGE
```javascript
npm install
npm run dev
```
Access server port: 3000
Access client port: 8080

### USERS ROUTES

| Routing | HTTP | Header(s) | Body | Response | Description |
| -- | -- | -- | -- | -- | -- |
| /users | POST | none | name : String (***required***), email : String (***required***), password : String (***required***) | Error: Internal server error Success: add new user | Create new user |
| /users/login| POST | none | email : String (***required***), password : String (***required***) | Error: Internal server error Success: login user | normal user login |
| /users/login-google | POST | none | Error: Internal server error Success: login google member | google user login |

### TODO ROUTES

| Routing | HTTP | Header(s) | Body | Response | Description |
| -- | -- | -- | -- | -- | -- |
| /todos | POST | token | name: STRING (***required***), description: STRING (***required***), due_date: DATE,(***required***) | Error: Internal server error, Validation error, Success: create new todo | create new todo |
| /todos | GET | token | Error: Internal server error, Success: Show all todos | Show all todos to user |
| /todos/:id/edit | PUT | token | Error: Internal server error, Success: change finish from false to true | change todo to finished |
| /todos/:id/delete | DELETE | token | Error: Internal server error, Success: delete finish selected todo | delete todo |