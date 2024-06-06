# GET - /api/navigation
Hämtar alla navigeringsobjekt.
# Returns
* Successful Response
```
    success: true,
    message: 'navigation items found.',
    status: 200,
    navigationItems: [...]
```
# Errors
* Unauthorized Access
```
    error.message = `Bad credentials: No info found for about page.`;
    error.status = 400;
    return next(error);
```
<br><br>

# GET - /api/navigation/setup
Ställer in standardnavigeringsobjekt om inga finns.

# Returns
* Successful Response
```
    success: true,
    message: 'navigation items found.',
    status: 200,
    navigationItems: [...]
```