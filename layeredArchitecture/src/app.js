import express from "express";
import cors from "cors";



import { config } from "./config";



export const app = express();

// app contains all express things
app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))


// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(config.api.prefix, apiRoutes)

app.get("/", (req, res) => {
    res.json({
        success: true
    })
})


