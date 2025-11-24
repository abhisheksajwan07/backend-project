import { BaseRepository } from "./BaseRepository.js";
import { Tool } from "../models/Tools.js";

/**
 * Is class ke bare main likh sakta hoon
 */
export class ToolRepository extends BaseRepository {
  constructor() {
    super(Tool);
  }

  /**
   * This method returns Tool by Tool Name
   * @param {*} name - Tool name
   * @returns
   */
  async findByName(name) {
    return await this.findOne({ name });
  }

  async findByCategory(category) {
    return await Tool.findByCategory(category);
  }

  async findPopular() {
    return await Tool.findPopular();
  }

  async search(searchQuery) {
    if (!searchQuery || searchQuery.trim() === "") {
      return [];
    }
    return await this.findAll(
      {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { tags: { $in: [new RegExp(searchQuery, "i")] } },
        ],
      },
      { sort: { createdAt: -1 } }
    );
  }
}
