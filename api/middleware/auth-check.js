const jwt  = require('jsonwebtoken');

module.exports = (req,res,next) =>{
    try{
        const token = req.body.token;
        const decoded = jwt.verify(token,'testapp');
        req.userData = decoded;
        next();
    }catch(error){
        return res.status(401).json({
            message:'Auth failed'
        })
    }
  

};