import dotenv from "dotenv";
import express from "express";
import connectDB from './db/index.js'
import cors from 'cors'
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser())

// CORS Configuration
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    }
))

connectDB()
.then(()=> {
    app.listen(port,() =>{
        console.log(`Server is running on port ${port}`);
    })
})
.catch(err=>{
    console.error("MongoDb connection error at index", err)
    process.exit(1);
})

// IMPORT ROUTES
import healthCheckRouter from './routes/healthcheck.router.js'
import authRouter from './routes/auth.route.js'

app.use("/api/v1/healthcheck",healthCheckRouter)
app.use("/api/v1/auth",authRouter)

app.get("/",(req,res) =>{
    res.send("Hello World");
})
