import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import UserLogin from './pages/Login'
import Register from './pages/Register'
import UserLayout from './pages/user/Layout'
import UserDashboard from './pages/user/Dashboard'
import UserAddBlog from './pages/user/AddBlog'
import MyBlogs from './pages/user/MyBlogs'
import 'quill/dist/quill.snow.css'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'

function App() {
    const { user } = useAppContext()

    return (
        <div>
            <Toaster />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/blog/:id' element={<Blog />} />
                <Route path='/login' element={<UserLogin />} />
                <Route path='/register' element={<Register />} />
                <Route path='/user' element={user ? <UserLayout /> : <UserLogin />}>
                    <Route index element={<UserDashboard />} />
                    <Route path='add-blog' element={<UserAddBlog />} />
                    <Route path='my-blogs' element={<MyBlogs />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App