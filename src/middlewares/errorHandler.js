import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: err.data
        });
    }

    // For unhandled errors
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: [err.message],
        data: null
    });
};

export { errorHandler };
