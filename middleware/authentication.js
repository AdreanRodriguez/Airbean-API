import jwt from 'jsonwebtoken';


const verifyToken = (req, res, next) => {
    jwt.verify(req.headers.authorization, process.env.SECRET_KEY, (err, decoded) => {
        if(err) return res.status(403).json({message:'Här får du inte vara!!'});
        let processedData = JSON.stringify(decoded, (key, value) => {return key !== 'password' ? value:undefined})
        req.user = JSON.parse(processedData);

        next();
    });
}

export default verifyToken;