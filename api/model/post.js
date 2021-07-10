const mongoose = require('mongoose');
const mongoosePagination = require('mongoose-paginate');

const user_postSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user_id:{type:String},
    post_title:{type:String},
    post_description:{type:String},
    status:{type: Number, default: 1},
    created:{type: Date, default: Date.now}
});
user_postSchema.plugin(mongoosePagination);
const amazon_accounts = mongoose.model("user_post", user_postSchema);
module.exports = amazon_accounts;