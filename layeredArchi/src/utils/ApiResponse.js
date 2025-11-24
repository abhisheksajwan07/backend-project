import { HttpStatus } from "../constants/httpStatus.js";

import { Messages } from "../constants/message.js";

class ApiResponse {
  /**
   * Send a successful JSON response
   * @param {object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {object|null} data - Response data
   * @param {object|null} meta - Additional metadata
   */

  static success(
    res,
    statusCode = HttpStatus.OK,
    message = Messages.SUCCESS,
    data = null,
    meta = null
  ) {
    const response = {
      success: true,
      message,
      ...(data !== null && { data }),
      ...(meta !== null && { meta }),
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send a 200 OK response
   * @param {object} res - Express response object
   * @param {object|null} data - Response data
   * @param {string} message - Response message
   * @param {object|null} meta - Additional metadata
   */
  static ok(res, data = null, message = Messages.SUCCESS, meta = null) {
    return this.success(res, HttpStatus.OK, message, data, meta);
  }

  /**
   * Send a 201 Created response
   * @param {object} res - Express response object
   * @param {object|null} data - Created resource data
   * @param {string} message - Response message
   */
  static created(res, data = null, message = Messages.CREATED) {
    return this.success(res, HttpStatus.CREATED, message, data);
  }

  /**
   * Send a 204 No Content response
   * @param {object} res - Express response object
   */
  static noContent(res) {
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  /**
   * Send a 207 Multi-Status response
   * @param {object} res - Express response object
   * @param {object|null} data - Response data
   * @param {string} message - Response message
   */
  static multiStatus(
    res,
    data = null,
    message = "Multi-status operation completed"
  ) {
    return this.success(res, HttpStatus.MULTI_STATUS, message, data);
  }

  /**
   * Send a paginated response (with pagination info)
   * @param {object} res - Express response object
   * @param {Array} data - Response data array
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {number} total - Total items count
   * @param {string} message - Response message
   */
  static paginated(res, data, page, limit, total, message = Messages.SUCCESS) {
    const meta = {
      count: data.length,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    };
    return this.success(res, HttpStatus.OK, message, data, meta);
  }

  /**
   * Send an error response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {*} errors - Additional error details
   */
  static error(
    res,
    message = Messages.ERROR.INTERNAL,
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    errors = null
  ) {
    const response = {
      success: false,
      message,
      ...(errors !== null && { errors }),
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send a 400 Bad Request error
   * @param {object} res - Express response object
   * @param {string} message - Error message
   * @param {*} errors - Validation errors
   */
  static badRequest(res, message = Messages.ERROR.BAD_REQUEST, errors = null) {
    return this.error(res, message, HttpStatus.BAD_REQUEST, errors);
  }

  /**
   * Send a 404 Not Found error
   * @param {object} res - Express response object
   * @param {string} message - Error message
   */
  static notFound(res, message = Messages.ERROR.NOT_FOUND) {
    return this.error(res, message, HttpStatus.NOT_FOUND);
  }

  /**
   * Send a 401 Unauthorized error
   * @param {object} res - Express response object
   * @param {string} message - Error message
   */
  static unauthorized(res, message = Messages.ERROR.UNAUTHORIZED) {
    return this.error(res, message, HttpStatus.UNAUTHORIZED);
  }

  /**
   * Send a 403 Forbidden error
   * @param {object} res - Express response object
   * @param {string} message - Error message
   */
  static forbidden(res, message = Messages.ERROR.FORBIDDEN) {
    return this.error(res, message, HttpStatus.FORBIDDEN);
  }
}

export default ApiResponse;
