const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Post = require('../model/post');




// create user

exports.create_user = (req,res,next)=>{
    
    let imagename = '';
    if(req.file){
        imagename = req.file.path;
    }else{
        imagename = 'upload/amazon_default.png';  
    }
    User.find({email:req.body.email})
    .exec()
    .then(email=>{
        if(email.length >= 1){
            return res.status(409).json({
                status:0,
                message:"Mail already exists"
            })
        }else{
            if(req.body.password.length >5){
                if(req.body.password != req.body.confirmpassword){
                    return res.status(201).json({
                        message:'Please give same password'
                    })
                }else{
                    bcrypt.hash(req.body.password,10,(err,hash)=>{
                        if(err){
                            return res.status(201).json({
                                error:err
                            })
                        }else{
                            
                            const user = new User({
                                _id:new mongoose.Types.ObjectId(),
                                name:req.body.name,
                                email:req.body.email,
                                password: hash,
                                phoneno:req.body.phoneno,
                                userimage:imagename
                            });
                            
                            user.save()
                            .then(result =>{
                                    const token = jwt.sign({
                                        email:req.body.email,
                                        userId :user._id
                                    },
                                    'testapp'
                                    ,{
                                        expiresIn:'1h'
                                    });
                                
                                    res.status(200).json({
                                        message:'User created successfully',
                                        status:'1',
                                        token:token
                                        
                                    });
                            })
                            .catch(err=>{
                                    console.log(err);
                                    res.status(201).json({error:err});
                            });
                        }
                    })
    
                }
            }else{
                return res.status(201).json({
                    message:'Password length must be greater than 6'
                });
            }

        }
    });
    
    
};

//Sign in user

exports.login_user = (req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        console.log(user)
        if(user.length < 1){
            return res.status(201).json({
                success:0,
                message:'Invalid user email'
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            //console.log(result);
            if(!result){
                return res.status(201).json({
                    success:0,
                    message:'Invalid password'
                })
            }
            if(result){
             const token = jwt.sign({
                   email:user[0].email,
                   userId :user[0]._id
                },
               'testapp'
                ,{
                    expiresIn:'1h'
                });
                return res.status(200).json({
                    message:'Login successfully.',
                    status:1,
                    token:token
                });
            }
            return res.status(201).json({
                message:'Auth failed',
                 status:0,
            })
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(201).json({error:err});
    });
};

exports.user_details = (req,res,next)=>{
    
    User.findById(req.userData.userId)
        .exec()
        .then(user => {
            return res.status(200).json({
                success:1,
                _id:user._id,
                name:user.name,
                email:user.email,
                phoneno:user.phoneno,
                userimage:req.hostname +':'+ process.env.PORT +'/'+user.userimage
            });
        })
        .catch(err=>{
            res.status(201).json({status:0,message:'No user details found',error:err});
        })
}
exports.add_post = (req,res,next)=>{
  
    const post = new Post({
        _id:new mongoose.Types.ObjectId(),
        user_id:req.userData.userId,
        post_description:req.body.description,
        post_title: req.body.title
    });
    
    post.save()
    .then(result =>{
        
            res.status(200).json({
                message:'Post created successfully',
                status:'1'
                
            });
    })
    .catch(err=>{
            res.status(201).json({error:err});
    });
}


exports.list_post = (req,res,next)=>{
    Post.find({user_id:req.userData.userId})
        .exec()
        .then(post => {
            return res.status(200).json({
                success:1,
                data :post
            });
        })
        .catch(err=>{
            res.status(201).json({status:0,message:'No user details found',error:err});
        })
}




