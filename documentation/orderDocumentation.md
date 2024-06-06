
# Order Controller Routes
## GET - /api/orders
Hämtar all orderhistorik från alla användare.

### Headers
```
authorization: "eafyasd..." // Värdet ska vara den token man får när man loggar in 
```

### Middleware
* [checkUserStrict](https://github.com/AdreanRodriguez/Aribean-API/blob/10-orderHistory/middleware/authentication.js#L8)
* [users.isAdmin](https://github.com/AdreanRodriguez/Aribean-API/blob/10-orderHistory/middleware/validation.js#L215)
* [orders.many](https://github.com/AdreanRodriguez/Aribean-API/blob/10-orderHistory/middleware/validation.js#L152)

### Returns 
* Successful Response
```
   success: true,
    message: 'Orders found.',
    status: 200,
    orders: [...]
```
<hr><br><br>

## GET - /api/orders/history
Hämtar orderhistorik för den autentiserade användaren.

### Middleware
* [checkUserStrict](https://github.com/AdreanRodriguez/Aribean-API/blob/10-orderHistory/middleware/authentication.js#L8)
* [orders.history](https://github.com/AdreanRodriguez/Aribean-API/blob/10-orderHistory/middleware/validation.js#L90)

### Headers
```
authorization: "eafyasd..." // Värdet ska vara den token man får när man loggar in 
```

### Returns
* Successful Response
```
    success: true,
    message: 'Orders found.',
    status: 200,
    orders: [...]
```

### Errors
```
    success: false,
    message: 'Unauthorized access.',
    status: 401
```
<hr><br><br>


## GET - /api/orders/:orderId
Hämtar specifik order med `orderId`

### Middleware
* [orders.one](https://github.com/AdreanRodriguez/Aribean-API/blob/10-orderHistory/middleware/validation.js#L15)

### Headers
```
authorization: "eafyasd..." // Värdet ska vara den token man får när man loggar in 
```
* Successful Response
```
    success: true,
    message: 'Order found.',
    status: 200,
    order: {...}
```
### Errors
```
    success: false,
    message: 'Unauthorized access.',
    status: 401
```

### Order not found
```
    success: false,
    message: 'Order not found.',
    status: 404
```
<hr><br><br>


## POST - /api/orders/:productId
Lägger till en produkt i användarens aktiva beställning.
>* Om man inte har en `token` så behöver man fylla i `orderId`.  
>* Om du är inloggad och har en `token` så ***behövs inte*** `orderId`, utan den parametern kan vara tom.  
>* `orderId` får du efter första varan är lagd i kundkorgen.
>* `amount` är valfri att ha med. 
>>* Om `amount` inte finns med som parameter:  `amount = 1`
>>* Om `amount` har ett negativt, eller 0, som värde: `amount = 1`

### Middleware
* [checkUser](https://github.com/AdreanRodriguez/Aribean-API/blob/10-orderHistory/middleware/authentication.js#L22)
* [orders.one](https://github.com/AdreanRodriguez/Airbean-API/blob/10-orderHistory/middleware/validation.js#L15)
* [products.one](https://github.com/AdreanRodriguez/Aribean-API/blob/10-orderHistory/middleware/validation.js#L130)
* [orders.userIdInsideOrder](https://github.com/AdreanRodriguez/Aribean-API/blob/10-orderHistory/middleware/validation.js#L111)

### Req.headers
```
authorization: "eafyasd..." // Värdet ska vara den token man får när man loggar in 
```

### Req.body
```
    orderId?: string,
    amount?: number
```
### Req.params
```
    productId: string,
```

### Returns

* Successful Response
```
    success: true,
    message: 'Product successfully added to order. Dont forget to add "orderId" inside body if this is a guest.',
    status: 200,
    order: {...},
    addedProduct: {...}
```
### Error
* Obehörig Åtkomst TILLTRÄDE FÖRBJUDET!
```
    success: false,
    message: 'Unauthorized access.',
    status: 401
```
### Order Not Found
```
    success: false,
    message: 'Order not found.',
    status: 404
```
<hr><br><br>

## DELETE - /api/orders/:productId
Tar bort en produkt i användarens aktiva beställning.
>* `orderId` Måste finnas som parameter.
>* Om man inte loggat in innan, när man börjat plocka produkter, utan gör det senare och fortsätter lägga i varor i kundkorgen, så kopplas `userId` till kundkorgen hädanefter. 
>* Om ett `userId` redan finns kopplat till ordern och man loggar ut, alternativt är inloggad på någon annan, och försöker ta bort varor från korgen så kommer detta inte gå. Därefter, när ett userId är kopplat till en order så kan det inte ändras eller kommas åt av varken gäst eller annan användare.
>* `amount` är valfri att ha med. 
>>* Om `amount` inte finns med som parameter:  `amount = 1`
>>* Om `amount` har ett negativt, eller 0, som värde: `amount = 1`  

### Middleware
* [orders.oneStrict](https://github.com/AdreanRodriguez/Airbean-API/blob/73f6f1830df02bbad8c492ed2c838366c135b0ad/middleware/validation.js#L44)
* [checkUser](https://github.com/AdreanRodriguez/Airbean-API/blob/73f6f1830df02bbad8c492ed2c838366c135b0ad/middleware/authentication.js#L22)
* [products.one](https://github.com/AdreanRodriguez/Airbean-API/blob/73f6f1830df02bbad8c492ed2c838366c135b0ad/middleware/validation.js#L130)
* [orders.userIdInsideOrder](https://github.com/AdreanRodriguez/Airbean-API/blob/73f6f1830df02bbad8c492ed2c838366c135b0ad/middleware/validation.js#L111)

### Req.headers
```
authorization: "eafyasd..." // Värdet ska vara den token man får när man loggar in 
```

### Req.body
```
    orderId: string,
    amount?: number
```
### Returns
* Successful Response
```
    success: true,
    message: 'Product successfully removed from order.',
    status: 200,
    order: {...},
    removedProduct: {...}
```

## Errors
* Unauthorized Access
```
    success: false,
    message: 'Unauthorized access.',
    status: 401
```
### Order Not Found
```
    success: false,
    message: 'Order not found.',
    status: 404
```

<hr><br><br>

## POST - /api/orders/:orderId/place
Placerar ordern vars orderId stämmer överens med `orderId`.

>* `orderId` måste finnas som parameter.
>* `userId` behöver finnas med om det existerar och stämmer överens med det userId som finns på ordern.
 

### Middleware
* [orders.oneStrict](https://github.com/AdreanRodriguez/Airbean-API/blob/73f6f1830df02bbad8c492ed2c838366c135b0ad/middleware/validation.js#L44)
* [checkUser](https://github.com/AdreanRodriguez/Airbean-API/blob/73f6f1830df02bbad8c492ed2c838366c135b0ad/middleware/authentication.js#L22)
* [orders.userIdInsideOrder](https://github.com/AdreanRodriguez/Airbean-API/blob/73f6f1830df02bbad8c492ed2c838366c135b0ad/middleware/validation.js#L111)
* [orders.isOrderPlaced](https://github.com/AdreanRodriguez/Airbean-API/blob/73f6f1830df02bbad8c492ed2c838366c135b0ad/middleware/validation.js#L102)


### Req.headers
```
    authorization: "eafyasd..." // Värdet ska vara den token man får när man loggar in 
```

### Req.body
```
    orderId: string,
    amount?: number
```
### Returns
* Successful Response
```
    success: true,
    message: 'Product successfully removed from order.',
    status: 200,
    order: {...},
    removedProduct: {...}
```

## Errors
* Unauthorized Access
```
    success: false,
    message: 'Unauthorized access.',
    status: 401
```
### Order Not Found
```
    success: false,
    message: 'Order not found.',
    status: 404
```
<hr><br><br>