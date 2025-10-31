import proxy from "express-http-proxy";
import { logger } from "./logger.js";

const baseProxyOptions = {
  proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/v1/, "/api"),
  proxyErrorHandler: (err, res) => {
    logger.error(`Proxy error: ${err?.message}`);
    res
      .status(500)
      .json({ message: "internal server error", error: err?.message });
  },
};

export function createProxy(serviceUrl, extraOptions = {}) {
  return proxy(serviceUrl, { ...baseProxyOptions, ...extraOptions });
}

// const proxyOptions = {
//   proxyReqPathResolver: (req) => {
//     return req.originalUrl.replace(/^\/v1/, "/api");
//   },
//   proxyErrorHandler: (err, res, next) => {
//     logger.error(`Proxy error: ${err.message}`);
//     res.status(500).json({
//       message: `Internal server error`,
//       error: err.message,
//     });
//   },
// };

// //setting up proxy for our identity service
// app.use(
//   "/v1/auth",
//   proxy(process.env.IDENTITY_SERVICE_URL, {
//     ...proxyOptions,
//     proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
//       proxyReqOpts.headers["Content-Type"] = "application/json";
//       return proxyReqOpts;
//     },
//     userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
//       logger.info(
//         `Response received from Identity service: ${proxyRes.statusCode}`
//       );

//       return proxyResData;
//     },
//   })
// );
