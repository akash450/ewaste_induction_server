import { asyncError } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import { sendEmail } from "../utils/features.js";

{/* Login user */}
export const login = asyncError(
    async (req, res, next) => {
        const {email, password} = req.body;
        const user = await User.findOne({email}).select("+password");

        //not the user stored in database
        if (!user) {
            return next(new ErrorHandler("User doesn't exist", 400));
        }
    
        //handle error
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new ErrorHandler("Incorrect email or password", 400));
        }

        const userToken = user.generateToken();

        res.json({userToken});
    }
);

{/* Register new user */}
export const register = asyncError(
    async (req, res, next) => {
        const {firstname, lastname, email, password, role} = req.body;

        let user = await User.findOne({email});

        //user already registered
        if (user) {
            return next(new ErrorHandler("User already exists", 400));
        }

        user = await User.create({
            firstname,
            lastname, 
            email, 
            password,
            role
        })
        const userToken = user.generateToken();

        res.json({userToken});
    }
);

{/* Log out user */}
export const logout = asyncError(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logged out successfully!"
    })
});

{/* Reset password */}
export const resetPassword = asyncError(async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if (!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
    }

    if (!password) {
        return next(new ErrorHandler("Please enter new password", 400));
    }

    user.password = password;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully! Please try signing in again."
    });
});

{/* Get the user points */}
export const getUserPoints = asyncError(async (req, res) => {
    const user = await User.findById(req.user._id);
    const points = user.points;

    res.status(200).json({
        success: true,
        points,
    });
});

{/* Get the user role */}
export const getUserRole = asyncError(async (req, res) => {
    const user = await User.findById(req.user._id);
    const role = user.role;

    res.status(200).json({
        success: true,
        role,
    });
});

{/* Update the user points */}
export const updateUserPoints = asyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const points = req.body.points;
    console.log(points);

    if (!points || points < 0) {
        return next(new ErrorHandler("Please enter valid points", 400));
    }

    user.points = points;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Points updated successfully!"
    });
});

export const getMail = asyncError(async (req, res, next) => {

    const volunteer = await User.findById(req.user._id);

    if (volunteer.role !== "volunteer") {
        return next(new ErrorHandler("Must be a volunteer", 400));
    }

    if (volunteer.isNotified === true) {
        return next(new ErrorHandler("Already notified volunteer", 400));
    }
    
    if (volunteer.points > 500) {
        const volunteerEmail = volunteer.email;
        const message = req.body.message;
        sendEmail(volunteerEmail, 'Congratulations!', message);

        volunteer.isNotified = true;

        await volunteer.save();

        res.status(200).json({
            success: true,
            message: "Email successfully sent!"
        });
    } else {
        return next(new ErrorHandler("Points must be above 500!", 400));
    }
})