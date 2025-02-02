import mongoose from "mongoose";

// Connect to MongoDB using the URI from the environment variable
export const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully!");
    } catch (error) {
        console.log("Error connecting to the database:", error);
    }
};
