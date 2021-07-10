const mongoose = require('mongoose');
const mongoosePagination = require('mongoose-paginate');

const userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name :{type:String,require:true},
    email:{type:String,require:true,unique:true},
    password:{type:String,require:true,minlength:6},
    confirmpassword:{type:String,require:true},
    phoneno:{type:String,require:true},
    userimage:{type:String}
});
userSchema.plugin(mongoosePagination);
const user = mongoose.model("users", userSchema);
module.exports = user;
