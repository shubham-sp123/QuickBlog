import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import fs from 'fs'
import imagekit from '../configs/imageKit.js'

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.json({ success: false, message: 'All fields are required' })

        const existingUser = await User.findOne({ email })
        if (existingUser)
            return res.json({ success: false, message: 'Email already registered' })

        if (password.length < 6)
            return res.json({ success: false, message: 'Password must be at least 6 characters' })

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword })
        const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET)

        res.json({
            success: true, token,
            user: { id: user._id, name: user.name, email: user.email }
        })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.json({ success: false, message: 'All fields are required' })

        const user = await User.findOne({ email })
        if (!user)
            return res.json({ success: false, message: 'Invalid credentials' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.json({ success: false, message: 'Invalid credentials' })

        const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET)

        res.json({
            success: true, token,
            user: { id: user._id, name: user.name, email: user.email }
        })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) return res.json({ success: false, message: 'User not found' })
        res.json({ success: true, user })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const addUserBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        if (!title || !description || !category || !imageFile)
            return res.json({ success: false, message: 'Missing required fields' })

        const user = await User.findById(req.userId)
        if (!user) return res.json({ success: false, message: 'User not found' })

        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        })

        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' },
                { format: 'webp' },
                { width: '1280' }
            ]
        })

        await Blog.create({
            title, subTitle, description, category,
            image: optimizedImageUrl,
            isPublished,
            author: req.userId,
            authorType: 'User',
            authorName: user.name
        })

        res.json({ success: true, message: 'Blog published successfully' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getUserBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.userId, authorType: 'User' }).sort({ createdAt: -1 })
        res.json({ success: true, blogs })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const toggleUserBlogPublish = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findOne({ _id: id, author: req.userId })
        if (!blog) return res.json({ success: false, message: 'Blog not found or unauthorized' })

        blog.isPublished = !blog.isPublished
        await blog.save()
        res.json({ success: true, message: 'Blog status updated' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const deleteUserBlog = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findOne({ _id: id, author: req.userId })
        if (!blog) return res.json({ success: false, message: 'Blog not found or unauthorized' })

        await Blog.findByIdAndDelete(id)
        await Comment.deleteMany({ blog: id })
        res.json({ success: true, message: 'Blog deleted successfully' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}