import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

function UserLayout() {
    const { navigate, logoutUser, user } = useAppContext()

    return (
        <>
            {/* Top bar */}
            <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200'>
                <img src={assets.logo} className='w-32 sm:w-40 cursor-pointer' alt="" onClick={() => navigate('/')} />
                <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm'>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className='text-sm text-gray-600 max-sm:hidden'>{user?.name}</span>
                    <button onClick={logoutUser} className='text-sm px-6 py-2 bg-primary text-white rounded-full cursor-pointer'>Logout</button>
                </div>
            </div>

            <div className='flex h-[calc(100vh-70px)]'>
                {/* Sidebar */}
                <div className='flex flex-col border-r border-gray-200 min-h-full pt-6'>
                    <NavLink end to='/user' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive ? 'bg-primary/10 border-r-4 border-primary' : ''}`}>
                        <img src={assets.home_icon} alt="" className='min-w-4 w-5' />
                        <p className='hidden md:inline-block'>Dashboard</p>
                    </NavLink>
                    <NavLink to='/user/add-blog' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive ? 'bg-primary/10 border-r-4 border-primary' : ''}`}>
                        <img src={assets.add_icon} alt="" className='min-w-4 w-5' />
                        <p className='hidden md:inline-block'>Add Blog</p>
                    </NavLink>
                    <NavLink to='/user/my-blogs' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive ? 'bg-primary/10 border-r-4 border-primary' : ''}`}>
                        <img src={assets.list_icon} alt="" className='min-w-4 w-5' />
                        <p className='hidden md:inline-block'>My Blogs</p>
                    </NavLink>
                </div>

                <Outlet />
            </div>
        </>
    )
}

export default UserLayout