import mongoose from "mongoose";

import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: [true, "Please enter first name"]
    },
    lastname:{
        type: String,
        required: [true, "Please enter last name"]
    },
    email:{
        type: String,
        required: [true, "Please enter email"],
        unique: [true, "Email already exists..."],
        validate: validator.isEmail
    },
    password:{
        type: String,
        required: [true, "Please enter password"],
        minLength: [8, "Password must be at least 8 characters long"],
        select: false
    },
    role: String,
    points: {
        type: Number,
        default: 0
    },
    /* For emailing users their reward (only once) */
    isNotified: {
        type: Boolean,
        default: false
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // don't do anything
    this.password = await bcrypt.hash(this.password, 10);
});

//Comparing hashed passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//Encoding JWT Token
{/* jwt.sign(
          payload,
          "secret",
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        ); */}

userSchema.methods.generateToken = function () {
    const payload = {_id: this._id };
    return jwt.sign(payload, 
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
    );
};

export const User = mongoose.model("User", userSchema);