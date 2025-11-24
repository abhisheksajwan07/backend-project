import express from "express";
import { ToolController } from "../controller/ToolController.js";
import { ToolService } from "../services/ToolService.js";
import { ToolRepository } from "../repositories/ToolRepository.js";

const router = express.Router();
const toolRepository = new ToolRepository();
const toolService = new ToolService(toolRepository);
const toolController = new ToolController(toolService);


// localhost:5000/api/tools/
router.get("/", toolController.getAllTools);
// localhost:5000/api/tools/popular
router.get("/popular", toolController.getPopularTools);
// localhost:5000/api/tools/category/frontend
router.get("/category/:category", toolController.getToolsByCategory);

// api/tools/:id
router.get("/:id", toolController.getToolById);
//api/tools/create
router.post("/create", toolController.createTool);
//api/tools/create/bulk
router.post("/create/bulk", toolController.createBulkTools);
//api/tools/:id
router.put("/:id", toolController.updateTool);
//api/tools/delete/bulk
router.delete("/delete/bulk", toolController.deleteBulkTools);
//api/tools/delete/:id
router.delete("/delete/:id", toolController.deleteTool);

export default router;


