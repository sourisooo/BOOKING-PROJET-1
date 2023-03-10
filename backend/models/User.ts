import { Request } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema, model } = require('mongoose');

export interface IUserRequest extends Request {
    user?: any
}

export interface IUser extends mongoose.Document {

    name: string,
    email: string,
    password: string,
    avatar?: string,
    isAdmin: boolean,
    token?: string,
    createdAt: Date,
    updatedAt: Date,
    comparePassword(entredPassword: string): Promise<Boolean> 

}

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },

    password: {
        type: String,
        required: true,
    },

    avatar: {
        type: String,
    },

    isAdmin: {
        type: Boolean,
        default: false,
    }

}, {
    timestamps: true
});

UserSchema.pre("save", async function(next) {

    const user = this as IUser;

    if(!user.isModified("password")) return next();

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);

    user.password = hash;

    next();

})

UserSchema.methods.comparePassword = function(entredPassword: string) {
    const user = this as IUser;
    return bcrypt.compareSync(entredPassword, user.password);
}

const User  = module.exports = model('convuser', UserSchema);

// const User = mongoose.model<IUser>("User", UserSchema);

export default User;

//Commentaires
//The next() call does not stop the rest of the code in your middleware function from executing. Use the 
//early return pattern to prevent the rest of your middleware function from running when you call next().
//Les actions réalisées lorsque le hook est actif consiste à crypter le mot de passe par bcrypt.
//Par ailleurs, une méthode est crée au sein du schema user:comparePassword permettant de comparer un string
//en entrée de fonction avec le user.password.