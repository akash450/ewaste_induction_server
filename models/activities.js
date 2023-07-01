import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter title"]
    },

    points: {
        type: Number,
        required: [true, "Please enter points"]
    },

    image: {
        public_id: String,
        url: String
    },

    steps: [
        {
            description: {
                type: String,
                required: true
            },
            
            video: {
                public_id: String,
                url: String
            }
        }
    ]
});

export const Activities = mongoose.model("Activities", activitySchema);