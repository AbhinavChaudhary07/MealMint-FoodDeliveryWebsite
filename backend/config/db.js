import dns from "dns"
import mongoose from "mongoose"

const connectDb = async()=>{
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is missing in .env")
        }

        dns.setServers(["8.8.8.8", "1.1.1.1"])

        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 10000,
        })
        console.log("db connected")
    } catch (error) {
        console.error("MongoDB connection failed:", error.message)
        process.exit(1)
    }
}

export default connectDb
