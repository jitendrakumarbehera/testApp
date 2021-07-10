const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const UserController = require('../controller/user');
const jwtAuth = require('../middleware/auth-check');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./upload/');
    },
    filename:function(req,file,cb){
        cb(null, Date.now()+file.originalname);
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
        cb(null,false); 
    }
};

const upload = multer({
        storage:storage,
        limits:{
            fileSize:1024*1024*20
        },
        fileFilter:fileFilter
    });

router.post('/signup',upload.single('userimage'),UserController.create_user);

router.post('/login',UserController.login_user);

router.post('/user_details',jwtAuth,UserController.user_details);

router.post('/add_post',jwtAuth,UserController.add_post);

router.post('/list_post',jwtAuth,UserController.list_post);



module.exports = router;