import { Messages } from "../constants/message.js";
import { ToolService } from "../services/ToolService.js";
import ApiResponse from "../utils/ApiResponse.js";

export class ToolController {
  // this not follow DI
  // Because yeh directly dependent on service
  // titghtly coupled
  //   constructor() {
  //     this.ToolService = new ToolService();
  //   }

  constructor(ToolService) {
    this.ToolService = ToolService;
  }
  // pass this where u instantiate this controller

  /**
   *
   * @param {*} req
   * @param {*} res
   *
   * - /api/tools?category='Frontend'&popular=true&limit=10
   * - /api/tools?category='Frontend'&limit=10
   * - ?sort=price:desc
   *  field="price",order="desc"
   * const field = "name";
      const obj = { [field]: 1 };

   */
  getAllTools = async (req, res) => {
    try {
      const { category, popular, search, limit, skip, sort, populate, select } =
        req.query;
      const filters = {};

      if (category) filters.category = category;
      if (popular === "true") filters.isPopular = true;

      const options = {};
      if (limit && !isNaN(limit)) options.limit = Number(limit);
      if (skip && !isNaN(skip)) options.skip = Number(skip);
      // if (limit) options.limit = parseInt(limit);
      // if (skip) options.skip = parseInt(skip);

      // if (sort) {
      //   const [field, order] = sort.split(":");
      //   options.sort = {
      //     [field]: order === "desc" ? -1 : 1,
      //   };
      // }

      let tools;
      if (search) {
        tools = await this.ToolService.searchTools(search);
      } else {
        tools = await this.ToolService.getAllTools(filters, options);
      }
      const count = tools ? tools.length : 0;
      return ApiResponse.ok(res, tools, Messages.FETCHED, {
        count,
      });
    } catch (error) {
      return ApiResponse.error(res, error.message);
    }
  };

  createTool = async (req, res) => {
    try {
      const toolData = req.body;
      
      const tool = await this.ToolService.createTool(toolData);

      res.status(201).json({
        success: true,
        message: "Tool created successfully",
        data: tool,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getToolById = async (req, res) => {
    try {
      const { id } = req.params;
      const tool = await this.ToolService.getToolById(id);

      res.status(200).json({
        success: true,
        data: tool,
      });
    } catch (error) {
      const statusCode = error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  };

  createBulkTools = async (req, res) => {
    try {
      const { tools } = req.body;

      if (!Array.isArray(tools)) {
        return res.status(400).json({
          success: false,
          message: "Tools should be an array",
        });
      }

      const results = await this.ToolService.createBulkTools(tools);

      const statusCode = results.failed.length === 0 ? 201 : 207;

      res.status(statusCode).json({
        success: true,
        message: `Bulk operation completed. ${results.created.length} created, ${results.failed.length} failed`,
        data: results,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  updateTool = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const tool = await this.ToolService.updateTool(id, updateData);

      res.status(200).json({
        success: true,
        message: "Tool updated successfully",
        data: tool,
      });
    } catch (error) {
      const statusCode = error.message.includes("not found")
        ? 404
        : error.message.includes("Validation failed")
        ? 400
        : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  };

  deleteTool = async (req, res) => {
    try {
      const { id } = req.params;
      const tool = await this.ToolService.deleteTool(id);

      res.status(200).json({
        success: true,
        message: "Tool deleted successfully",
        data: tool,
      });
    } catch (error) {
      const statusCode = error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  };

  deleteBulkTools = async (req, res) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids)) {
        return res.status(400).json({
          success: false,
          message: "IDs should be an array",
        });
      }

      const results = await this.ToolService.deleteBulkTools(ids);

      const statusCode = results.failed.length === 0 ? 200 : 207;

      res.status(statusCode).json({
        success: true,
        message: `Bulk deletion completed. ${results.deleted.length} deleted, ${results.failed.length} failed`,
        data: results,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getToolsByCategory = async (req, res) => {
    try {
      const { category } = req.params;
      const tools = await this.ToolService.getToolsByCategory(category);

      res.status(200).json({
        success: true,
        count: tools.length,
        data: tools,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getPopularTools = async (req, res) => {
    try {
      const tools = await this.ToolService.getPopularTools();

      res.status(200).json({
        success: true,
        count: tools.length,
        data: tools,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
}
