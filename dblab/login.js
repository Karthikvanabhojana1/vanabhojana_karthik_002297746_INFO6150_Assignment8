// db.createCollection("login");
// db.login.insertOne({
//     Name: '',
//     mail: '',
//     password: ''
// })


const mongoose= require('mongoose');
const schema=mongoose.Schema;

const userSchema= new schema({
    name:{
        type: String,
        unique: true,
        required: true

    },
    email:{
        type: String,
        unique: true,
        required: true

    },
    password:{
        type: String,
        unique: true,
        required: true
    }
}, {timestamps: true})


const User=mongoose.model('User',userSchema);
module.exports=User;
