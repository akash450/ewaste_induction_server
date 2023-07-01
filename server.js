import {app} from './app.js';
import { connectToDatabase } from './config/database.js';
import cloudinary from "cloudinary";

//connect to database
connectToDatabase();

cloudinary.v2.config(
    {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
        
    }
)

app.listen(process.env.PORT, ()=> {
    console.log("Server is running on port " + process.env.PORT);
})
