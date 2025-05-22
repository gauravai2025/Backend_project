import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export const authenticate = async (req, res, next) => {
  try {
    // 🧠 Try Bearer token from headers
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 🍪 Fallback: try accessToken from cookies
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // ❌ No token found
    if (!token) {
      return next(new ApiError(401, "Authorization token missing or malformed"));
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 🔍 Validate user exists
    const user = await User.findById(decoded._id).select("_id username email");
    if (!user) {
      return next(new ApiError(401, "Invalid token: user no longer exists"));
    }

    // 👤 Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(403, "Invalid or expired token", [], error.stack));
  }
};
