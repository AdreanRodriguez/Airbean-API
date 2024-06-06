import jwt from 'jsonwebtoken';
const error = new Error();

const SECRET_KEY = process.env.SECRET_KEY || "a59be5d7-0753-4d62-b665-e62d62a63c5b";

const authentication = {

    checkUserStrict: (req, res, next) => {
        jwt.verify(req.headers.authorization, SECRET_KEY, (err, decoded) => {
            if(err){
                error.message = 'Unauthorized access: ';
                error.status = 400;
                return next(error);
            }
            delete decoded.password;
            req.user = decoded;
    
            next();
        });
    },

    checkUser: (req, res, next) => {
        jwt.verify(req.headers.authorization, SECRET_KEY, (err, decoded) => {
            if(decoded){
                let processedData = JSON.stringify(decoded, (key, value) => {return key !== 'password' ? value:undefined})
                req.user = JSON.parse(processedData);    
            } 
            next();
        });
    },

}

export default authentication;





