import jwt from 'jsonwebtoken';
const newError = new Error();

const SECRET_KEY = process.env.SECRET_KEY || "a59be5d7-0753-4d62-b665-e62d62a63c5b";

const authentication = {
    verifyToken: (req, res, next) => {
        jwt.verify(req.headers.authorization, SECRET_KEY, (err, decoded) => {
            if(err){
                newError.message = 'Unauthorized access';
                newError.status = 400;
                return next(newError);
            }
            let processedData = JSON.stringify(decoded, (key, value) => {return key !== 'password' ? value:undefined})
            req.user = JSON.parse(processedData);
    
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

// export const verifyToken = (req, res, next) => {
//     jwt.verify(req.headers.authorization, SECRET_KEY, (err, decoded) => {
//         if(err) return res.status(403).json({message:'Här får du inte vara!!'});
//         let processedData = JSON.stringify(decoded, (key, value) => {return key !== 'password' ? value:undefined})
//         req.user = JSON.parse(processedData);

//         next();
//     });
// }

// export const checkUser = (req, res, next) => {

//     jwt.verify(req.headers.authorization, SECRET_KEY, (err, decoded) => {
//         if(err) return res.status(403).json({message:'Här får du inte vara!!'});
//         let processedData = JSON.stringify(decoded, (key, value) => {return key !== 'password' ? value:undefined})
//         req.user = JSON.parse(processedData);

//         next();
//     });
// }





