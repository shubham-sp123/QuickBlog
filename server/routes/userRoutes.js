import express from 'express'
import { registerUser, loginUser, getUserProfile, addUserBlog, getUserBlogs, toggleUserBlogPublish, deleteUserBlog } from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/profile', userAuth, getUserProfile)
userRouter.post('/add-blog', upload.single('image'), userAuth, addUserBlog)
userRouter.get('/blogs', userAuth, getUserBlogs)
userRouter.post('/toggle-publish', userAuth, toggleUserBlogPublish)
userRouter.post('/delete-blog', userAuth, deleteUserBlog)

export default userRouter;