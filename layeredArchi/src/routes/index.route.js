import express from "express";
import toolBarRoutes from "./toolbox.route.js";

export const router = express.Router();
// Routers

router.use("/tools", toolBarRoutes);
