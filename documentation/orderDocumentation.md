
# Order Controller Routes
## GET - /api/orders
Hämtar all orderhistorik från alla användare.

### Headers
```
authorization: "eafyasd..." // Värdet ska vara den token man får när man loggar in 
```

### Middleware
* checkUserStrict
* users.isAdmin
* orders.many

### Returns 
* Successful Response
```
   success: true,
    message: 'Orders found.',
    status: 200,
    orders: [...]
```
<br><br>
## GET - /api/orders/history
Hämtar orderhistorik för den autentiserade användaren.

### Middleware
* checkUserStrict
* orders.history

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
<hr style="
height:3px; 
background-color: grey; 
border-radius: 2px; 
margin-top: 2rem; margin-bottom:5rem;">


## GET - /api/orders/:orderId
Hämtar specifik order med `orderId`

### Middleware
* orders.one

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
<br><br> 

## POST - /api/orders/:productId
Lägger till en produkt i användarens aktiva beställning.
>* Om man inte har en `token` så behöver man fylla i `orderId`.  
>* Om du är inloggad och har en `token` så **behövs inte** `orderId`, utan den parametern kan vara tom.  
>* `orderId` får du efter första varan är lagd i kundkorgen.
>* `amount` är valfri att ha med. 
>>* Om `amount` inte finns med som parameter:  `amount = 1`
>>* Om `amount` har ett negativt, eller 0, som värde: `amount = 1`  
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
<br><br>

## DELETE - /api/orders/
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