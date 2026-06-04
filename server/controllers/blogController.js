import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import main from '../configs/gemini.js';

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true })
        res.json({ success: true, blogs })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId)
        if (!blog) return res.json({ success: false, message: 'Blog not found' });
        res.json({ success: true, blog });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;
        // auto-approve, no admin review needed
        await Comment.create({ blog, name, content, isApproved: true });
        res.json({ success: true, message: 'Comment added!' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });
        res.json({ success: true, comments })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        const content = await main(prompt + ' Generate a blog content for this topic in simple text format')
        res.json({ success: true, content })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const summarizeBlog = async (req, res) => {
    try {
        const { blogId } = req.body;
        const blog = await Blog.findById(blogId);
        if (!blog) return res.json({ success: false, message: 'Blog not found' });

        const plainText = blog.description.replace(/<[^>]*>/g, '');
        const prompt = `Summarize the following blog article in 3-5 concise sentences. Title: "${blog.title}". Content: ${plainText}`;
        const content = await main(prompt);
        res.json({ success: true, content });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const chatWithBlog = async (req, res) => {
    try {
        const { blogId, question, history } = req.body;
        const blog = await Blog.findById(blogId);
        if (!blog) return res.json({ success: false, message: 'Blog not found' });

        const plainText = blog.description.replace(/<[^>]*>/g, '');
        const prompt = `
You are a knowledgeable and friendly AI assistant. The user is reading a blog article and may ask questions related to it or on any topic.

Use the blog as context to better understand what the user might be referring to, but do not limit yourself to only what the blog says.

Blog Title: "${blog.title}"
Blog Content: ${plainText}

Previous conversation:
${history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n')}

User's question: ${question}

Respond conversationally in 2-4 sentences max. Be direct and to the point — only answer what was asked, nothing more. Use simple language.`;

        const content = await main(prompt);
        res.json({ success: true, content });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}