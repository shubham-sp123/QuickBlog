import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

function UserDashboard() {
    const { axios, user } = useAppContext()
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

    useEffect(() => { fetchMyBlogs() }, [])

    const published = blogs.filter(b => b.isPublished).length
    const drafts = blogs.filter(b => !b.isPublished).length

    return (
        <div className='flex-1 p-4 md:p-10 bg-blue-50/50'>
            <h2 className='text-xl font-semibold text-gray-700 mb-6'>Welcome back, {user?.name}!</h2>

            {/* Stats */}
            <div className='flex flex-wrap gap-4 mb-10'>
                <div className='flex items-center gap-4 bg-white p-5 min-w-52 rounded-lg shadow cursor-pointer hover:scale-105 transition-all'>
                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                        <svg className='w-5 h-5 text-primary' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                        </svg>
                    </div>
                    <div>
                        <p className='text-2xl font-semibold text-gray-700'>{blogs.length}</p>
                        <p className='text-gray-400 text-sm'>Total Blogs</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 bg-white p-5 min-w-52 rounded-lg shadow cursor-pointer hover:scale-105 transition-all'>
                    <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
                        <svg className='w-5 h-5 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                        </svg>
                    </div>
                    <div>
                        <p className='text-2xl font-semibold text-gray-700'>{published}</p>
                        <p className='text-gray-400 text-sm'>Published</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 bg-white p-5 min-w-52 rounded-lg shadow cursor-pointer hover:scale-105 transition-all'>
                    <div className='w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center'>
                        <svg className='w-5 h-5 text-orange-500' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                        </svg>
                    </div>
                    <div>
                        <p className='text-2xl font-semibold text-gray-700'>{drafts}</p>
                        <p className='text-gray-400 text-sm'>Drafts</p>
                    </div>
                </div>
            </div>

            {/* Recent blogs table */}
            <h3 className='text-gray-600 font-medium mb-3'>Recent Blogs</h3>
            <div className='relative max-w-4xl overflow-x-auto shadow rounded-lg bg-white'>
                <table className='w-full text-sm text-gray-500'>
                    <thead className='text-xs text-gray-600 uppercase text-left'>
                        <tr>
                            <th className='px-4 py-3'>#</th>
                            <th className='px-4 py-3'>Title</th>
                            <th className='px-4 py-3 max-sm:hidden'>Date</th>
                            <th className='px-4 py-3'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className='text-center py-8 text-gray-400'>Loading...</td></tr>
                        ) : blogs.slice(0, 5).map((blog, i) => (
                            <tr key={blog._id} className='border-t border-gray-100'>
                                <td className='px-4 py-3'>{i + 1}</td>
                                <td className='px-4 py-3 font-medium text-gray-700'>{blog.title}</td>
                                <td className='px-4 py-3 max-sm:hidden'>{new Date(blog.createdAt).toDateString()}</td>
                                <td className='px-4 py-3'>
                                    <span className={`text-xs px-2 py-1 rounded-full ${blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {blog.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {!loading && blogs.length === 0 && (
                            <tr><td colSpan={4} className='text-center py-8 text-gray-400'>No blogs yet. Create your first one!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserDashboard