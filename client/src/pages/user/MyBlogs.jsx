import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { assets } from '../../assets/assets'

function MyBlogs() {
    const { axios } = useAppContext()
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchMyBlogs = async () => {
        try {
            const { data } = await axios.get('/api/user/blogs')
            if (data.success) setBlogs(data.blogs)
            else toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const togglePublish = async (id) => {
        try {
            const { data } = await axios.post('/api/user/toggle-publish', { id })
            if (data.success) {
                toast.success(data.message)
                fetchMyBlogs()
            } else toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const deleteBlog = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return
        try {
            const { data } = await axios.post('/api/user/delete-blog', { id })
            if (data.success) {
                toast.success(data.message)
                fetchMyBlogs()
            } else toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => { fetchMyBlogs() }, [])

    return (
        <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
            <h1 className='text-gray-700 font-semibold mb-4'>My Blogs</h1>
            <div className='relative max-w-4xl overflow-x-auto shadow rounded-lg bg-white'>
                <table className='w-full text-sm text-gray-500'>
                    <thead className='text-xs text-gray-600 uppercase text-left'>
                        <tr>
                            <th className='px-2 py-4 xl:px-6'>#</th>
                            <th className='px-2 py-4'>Blog Title</th>
                            <th className='px-2 py-4 max-sm:hidden'>Date</th>
                            <th className='px-2 py-4 max-sm:hidden'>Status</th>
                            <th className='px-2 py-4'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className='text-center py-10 text-gray-400'>Loading...</td></tr>
                        ) : blogs.length === 0 ? (
                            <tr><td colSpan={5} className='text-center py-10 text-gray-400'>No blogs yet. Start writing!</td></tr>
                        ) : blogs.map((blog, index) => (
                            <tr key={blog._id} className='border-y border-gray-200'>
                                <td className='px-2 py-4 xl:px-6'>{index + 1}</td>
                                <td className='px-2 py-4 font-medium text-gray-700 max-w-xs truncate'>{blog.title}</td>
                                <td className='px-2 py-4 max-sm:hidden'>{new Date(blog.createdAt).toDateString()}</td>
                                <td className='px-2 py-4 max-sm:hidden'>
                                    <span className={blog.isPublished ? 'text-green-600' : 'text-orange-600'}>
                                        {blog.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className='px-2 py-4'>
                                    <div className='flex items-center gap-3'>
                                        <button
                                            onClick={() => togglePublish(blog._id)}
                                            className='border px-2 py-0.5 rounded text-xs cursor-pointer hover:bg-gray-50'
                                        >
                                            {blog.isPublished ? 'Unpublish' : 'Publish'}
                                        </button>
                                        <img
                                            onClick={() => deleteBlog(blog._id)}
                                            src={assets.cross_icon}
                                            className='w-8 hover:scale-110 transition-all cursor-pointer'
                                            alt="delete"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyBlogs