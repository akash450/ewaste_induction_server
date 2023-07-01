import { asyncError } from "../middlewares/error.js";
import { Activities } from "../models/activities.js";
import cloudinary from "cloudinary";
import ErrorHandler from "../utils/error.js";

export const getAllActivities = asyncError(async(req, res) => {
    const activities = await Activities.find({});

    res.status(200).json({
        success: true,
        activities
    });

});

export const createActivity = asyncError(async(req, res, next) => {
    const {title, points} = req.body;

    if (!req.file) {
        console.log(req.file);
        return next(new ErrorHandler("Please add image", 400));
    }

    console.log(req.file);
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const myCloudImage = await cloudinary.v2.uploader.upload(dataURI);
    const image = {
        public_id: myCloudImage.public_id,
        url: myCloudImage.secure_url
    };

    //by default next step is null until you make a next node
    const activity = await Activities.create({
        title,
        points,
        image,
        steps:[]
    });

    activity.save();

    console.log("Activity created!")

    res.status(200).json({
        success: true,
        message: "Activity created successfully!"
    });

});

export const deleteActivity = asyncError(async(req, res, next) => {
    const activity = await Activities.findById(req.params.id);

    if (!activity) {
        return next(new ErrorHandler("Activity not found!", 404));
    }

    // Delete the image file from the server or cloud storage
    // Here's an example using the cloudinary npm package:
    const public_id = activity.image.public_id;
    cloudinary.uploader.destroy(public_id);

    // Remove the activity from the database
    await activity.deleteOne({"_id": req.params.id});

    res.status(200).json({
        success: true,
        message: "Activity deleted successfully!"
    });
});

export const createStep = asyncError(async (req, res, next) => {

    const description = req.body.description;

    if (!req.file) {
        return next(new ErrorHandler("Please add video", 400));
    }
    console.log(req.file);
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const myCloudVideo = await cloudinary.v2.uploader.upload(dataURI, 
        {
            resource_type: "video"
        }
    );
    const video = {
        public_id: myCloudVideo.public_id,
        url: myCloudVideo.secure_url
    };

    console.log(video);

    const newStep = {
        description: description,
        video: video
    };
    
    const activity = await Activities.findById(req.params.id);

    console.log(activity);

    console.log("Creating step...");

    // add the new step to the activity and save it
    console.log("Pushing step...");
    activity.steps.push(newStep);

    //save steps in current activity
    activity.save();

    res.status(200).json({
        success: true,
        message: "Step added successfully!"
    });
});