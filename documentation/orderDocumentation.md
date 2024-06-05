# errorHandler 
Felhanterings-middleware fångar upp alla fel som uppstår under begäransbehandlingen och skickar ett JSON-svar med felinformation.

## Returns
* Error Response
```
    success: false,
    message: 'Internal server error.',
    status: 500
```


# Order Controller Routes
# GET - /api/orders
Hämtar all orderhistorik.

### Headers
```
authorization: Bearer <token>
```

### Returns 
* Successful Response
```
   success: true,
    message: 'Orders found.',
    status: 200,
    orders: [...]
```

# GET - /api/orders/history
Hämtar orderhistorik för den autentiserade användaren.

## Headers
```
authorization: Bearer <token>
```

## Returns
* Successful Response
```
    success: true,
    message: 'Orders found.',
    status: 200,
    orders: [...]
```

## Errors
```
    success: false,
    message: 'Unauthorized access.',
    status: 401
```
# GET - /api/orders/

## Headers
```
    authorization: Bearer <token>
```
* Successful Response
```
    success: true,
    message: 'Order found.',
    status: 200,
    order: {...}
```
## Errors
```
    success: false,
    message: 'Unauthorized access.',
    status: 401
```

## Order not found
```
    success: false,
    message: 'Order not found.',
    status: 404
```

# POST - /api/orders/
Lägger till en produkt i användarens aktiva beställning.
```
    authorization: Bearer <token>
```
## Req.body
```
    orderId: string,
    amount?: number
```

## Returns

* Successful Response
```
    success: true,
    message: 'Product successfully added to order. Dont forget to add "orderId" inside body if this is a guest.',
    status: 200,
    order: {...},
    addedProduct: {...}
```
## Error
* Obehörig Åtkomst TILLTRÄDE FÖRBJUDET!
```
    success: false,
    message: 'Unauthorized access.',
    status: 401
```
## Order Not Found
```
    success: false,
    message: 'Order not found.',
    status: 404
```

# DELETE - /api/orders/
```
    authorization: Bearer <token>
```
## Req.body
```
    orderId: string,
    amount?: number
```
## Returns
* Successful Response
```
    success: true,
    message: 'Product successfully removed from order.',
    status: 200,
    order: {...},
    removedProduct: {...}
```

# Errors
* Unauthorized Access
```
    success: false,
    message: 'Unauthorized access.',
    status: 401
```
## Order Not Found
```
    success: false,
    message: 'Order not found.',
    status: 404
```