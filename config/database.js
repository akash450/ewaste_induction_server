import mongoose from 'mongoose';

export const connectToDatabase = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "ewaste-database"
        });
    console.log(`MongoDB connected: ${connection.host}`);
    } catch (error) {
        console.log("Some error occurred", error);
        process.exit(1);
    }
}