# POST - /api/auth/register

Skapar en ny användare baserat på information från `req.body`

## Req.body
```
	username: string,
	password: string,
	verifyPassword: string,
	email: string,
	firstName: string,
	lastName: string,
	address: string
```

## Returns

* #### Successful Response
```
	success: true,
	message: 'Successfully added user',
	status: 201 
```

## Errors

* ### Någon av parametrarna saknas
```
	success: false,
	message: '\"xxxxx\" is required', // xxxxx == variabel som saknas i `req.body`
	status: 400
```

* ### `password` och `verifyPassword` stämmer inte överens
```
	success: false,
	message = 'Passwords are not equal.',
	status = 401,
```
* ### `username` används redan av någon annan
```
	success: false,
	message = 'Username already taken.',
	status = 401,
```

# POST - /api/auth/login

Loggar in användare till hemsidan

**Returnerar en `token` som man behöver lägga till i headers för att säkerställa att man är inloggad gällande andra anrop.**

## Req.body
```
	username: string,
	password: string,
```

## Returns

* ### Successful Response
```
	success: true,
	message: 'Logged in succesfully!',
	status: 202,
	token: "eyhcjklas..." 
```

## Errors

* ### Någon av parametrarna saknas
```
	success: false,
	message: '\"xxxxx\" is required', // xxxxx == variabel som saknas i `req.body`
	status: 400
```

* ### Uppgifterna stämmer inte överens med någon användare
```
	success: false,
	message = 'Bad credentials: Wrong username or password.',
	status = 400,
```
# GET - /api/auth/users 
*KAN ENDAST ANVÄNDAS SOM ADMIN*

Returnerar alla användare.
*(Av säkerhetsskäl så skickas inte lösenorden med)*

## Returns

* ### Successful Response
```
	success: true,
	message: 'Active users found!',
	status: 202,
	users: [{...},{...}] 
```

## Errors

* ### Användaren är inte klassad som admin
```
	success: false,
	message = 'Unauthorized access.',
	status = 400
```

# GET - /api/auth/users/:usersId
*KAN ENDAST ANVÄNDAS SOM ADMIN*

Returnerar specifik användare.
*(Av säkerhetsskäl så skickas inte lösenorden med)*


## Returns

* ### Specifik användare hittad (på id)

```
	"success": true,
	"message": "User found",
	"status": 201,
	"user": {
		"username": "username",
		"userId": "userId",
		"email": "din@email.se",
		"firstName": "förnamn",
		"lastName": "efternamn",
		"address": "adress",
		"isAdmin": true,
		"_id": "3wzAzlIUg0WqhOzt"
	}
```

## Errors
``` 
	"success": false,
	"message": "Unauthorized access: ",
	"status": 400
```