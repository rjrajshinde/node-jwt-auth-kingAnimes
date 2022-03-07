const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Enter an E-mail'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid E-mail']
    },
    password: {
        type: String,
        required: [true, 'Enter the Password'],
        minlength: [6, "Minimum Password length is 6 characters"]
    }
})

//fire a function after the document is saved
// userSchema.post('save',function(doc, next){
//     console.log("new user was created and saved", doc);
//     next();
// })

//fire a function before the document is saved
//for encrypting the password before save function
userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method for login the user
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email: email}); //here this is refers to the usermodel or database 
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error("Invalid Credentials")
    }
    throw Error("Invalid Credentials")
}

module.exports = mongoose.model('users', userSchema)