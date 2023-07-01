import express from "express";
import {config} from 'dotenv';
// Importing routers here
import user from "./routes/user.js";
import activities from "./routes/activities.js";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";

//config environment
config({
    path:'./config/config.env'
})

export const app = express();

//Using middlewares
app.use(express.json({limit: '200mb'}));
app.use(express.urlencoded({limit: '200mb', extended: true})); //accept JSON data
app.use(cors());

app.use("/api/v1/user", user);
app.use("/api/v1/activities", activities);

// Using error middleware

app.use(errorMiddleware);