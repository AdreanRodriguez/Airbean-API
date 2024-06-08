# GET - /api/products
*Fetches all products.*
## Returns
* Successful Response
```
    success: true,
    message: 'Products found.',
    status: 200,
    products: [...]
```
## Errors
* Internal Server Error
```
    success: false,
    message: 'Internal server error.',
    status: 500
```
<hr><br><br>

# GET - /api/products/:productId
*Fetches a specific product by its ID.*
## Returns
* Successful Response
```
    success: true,
    message: 'Product found.',
    status: 200,
    product: {...}
```
# Errors
* Product Not Found
```
    success: false,
    message: 'Product not found.',
    status: 404
```
<hr><br><br>