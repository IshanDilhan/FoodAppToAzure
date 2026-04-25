import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        let token;

        // Support both "token" in headers and "Authorization: Bearer <token>"
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.headers.token) {
            token = req.headers.token;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
        }

        // Verify token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: "Invalid Token. Login Again." });
    }
};

export default authUser;
