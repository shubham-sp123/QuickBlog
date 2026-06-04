import jwt from 'jsonwebtoken'

const userAuth = (req, res, next) => {
    const token = req.headers['userauthorization']; // express lowercases headers

    if (!token) {
        return res.json({ success: false, message: 'Not authorized, please login' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== 'user') {
            return res.json({ success: false, message: 'Not authorized' })
        }
        req.userId = decoded.id
        next();
    } catch (error) {
        res.json({ success: false, message: 'Invalid token' })
    }
}

export default userAuth;