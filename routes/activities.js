import express from "express";
import { createActivity, createStep, deleteActivity, getAllActivities } from "../controllers/activities.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleUpload} from "../middlewares/multer.js";

const router = express.Router();

//http://localhost:4000/api/v1/activities/allactivities
router.get("/allactivities", isAuthenticated, getAllActivities);
//http://localhost:4000/api/v1/activities/addactivity
router.post("/addactivity", isAuthenticated, singleUpload, createActivity);
//http://localhost:4000/api/v1/activities/deleteactivity/id
router.delete("/deleteactivity/:id", isAuthenticated, deleteActivity);
//http://localhost:4000/api/v1/activities/addstep
router.post("/addstep/:id", isAuthenticated, singleUpload, createStep);

export default router;