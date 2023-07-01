import ErrorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
import { asyncError } from "./error.js";
import { User } from "../models/user.js";

//if user not logged in
export const isAuthenticated = asyncError(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const userToken = authHeader && authHeader.split(' ')[1];

    if (!authHeader) {
        return next(new ErrorHandler("You couldn't be authorized", 401));
    }

    if (userToken === null) {
        return next(new ErrorHandler("Not logged in", 401));
    }

    //verify the token
    const decodedJwt = jwt.verify(userToken, process.env.JWT_SECRET);
    req.user = await User.findById(decodedJwt._id);
    next();
});
