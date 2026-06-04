import express from 'express'
import { addComment, getAllBlogs, getBlogById, getBlogComments, generateContent, summarizeBlog, chatWithBlog } from '../controllers/blogController.js';
import userAuth from '../middleware/userAuth.js';

const blogRouter = express.Router();

blogRouter.get('/all', getAllBlogs)
blogRouter.post('/add-comment', addComment)
blogRouter.post('/comments', getBlogComments)
// blogRouter.post('/generate', generateContent)
blogRouter.post('/generate', userAuth, generateContent)  // ✅ protected

blogRouter.post('/summarize', summarizeBlog)
blogRouter.post('/chat', chatWithBlog)
blogRouter.get('/:blogId', getBlogById)

export default blogRouter;