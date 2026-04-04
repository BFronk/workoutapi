function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        next(); // user is logged in → continue
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = isAuthenticated;