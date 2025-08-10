"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateUser = void 0;
const supabase_1 = require("../lib/supabase");
const authenticateUser = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                error: "No authorization token provided",
            });
            return;
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        // Verify token with Supabase
        const { data: { user }, error, } = await supabase_1.supabaseAuth.auth.getUser(token);
        if (error || !user) {
            console.error("Token verification failed:", error);
            res.status(401).json({
                error: "Invalid or expired token",
            });
            return;
        }
        // Add user to request object
        req.user = {
            id: user.id,
            email: user.email || "",
            role: user.role,
        };
        // Continue to next middleware/route handler
        next();
    }
    catch (error) {
        console.error("Authentication middleware error:", error);
        res.status(500).json({
            error: "Internal server error during authentication",
        });
    }
};
exports.authenticateUser = authenticateUser;
// Optional middleware for routes that can work with or without auth
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            const { data: { user }, } = await supabase_1.supabaseAuth.auth.getUser(token);
            if (user) {
                req.user = {
                    id: user.id,
                    email: user.email || "",
                    role: user.role,
                };
            }
        }
        next();
    }
    catch (error) {
        // If optional auth fails, just continue without user
        next();
    }
};
exports.optionalAuth = optionalAuth;
