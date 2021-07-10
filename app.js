const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser'); 
const router = express.Router();
const mongoose = require('mongoose');
const env = require('dotenv');

env.config({
    path:"./.env"
});



// Header access
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-requested-With,Content-Type,Accept,Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE');
        return res.status(200).json({});
    }
    next();
});

// Routing api
const userRoutes = require('./api/routes/user'); 



const mongoDB = 'mongodb://127.0.0.1:27017/testapp';;
try {
    mongoose.connect(mongoDB,{
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify:false,
        useCreateIndex:true
    });
} catch (error) {
    res.json({
        error:{
            message:error
        }
    })
}

//mongoose promise
 mongoose.Promise = global.Promise;



app.use(morgan('dev'));
app.use('/upload',express.static('upload'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// this is node handleing
app.use('/user',userRoutes);

//Erorr Handleing ...
app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status=404;
    next(error);
}); 
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
    
});


module.exports = app;