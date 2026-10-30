const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

// Verifies the JWT and loads the current user from the DB,
// so blocked users or deleted users lose access immediately.
const protect = async (req, res, next) => {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.id).select("role isBlocked company");
    if (!user) {
        return res.status(401).json({ message: "User no longer exists" });
    }
    if (user.isBlocked) {
        return res.status(403).json({ message: "Your account has been blocked by admin" });
    }

    req.user = {
        id: user._id.toString(),
        role: user.role,
        company: user.company ? user.company.toString() : null,
    };
    next();
};

// Role-based access control
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied: you are not allowed" });
        }
        next();
    };
};

module.exports = { protect, authorize };
