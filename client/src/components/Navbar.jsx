import React, { useState, useRef, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'

function Navbar() {
    const { navigate, user, logoutUser } = useAppContext()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setDropdownOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'} border-b border-gray-100`}>
            <div className='flex justify-between items-center h-16 px-6 sm:px-12 xl:px-24 max-w-7xl mx-auto'>

                {/* Logo */}
                <div onClick={() => navigate('/')} className='cursor-pointer flex items-center gap-2'>
                    <div className='w-7 h-7 bg-primary rounded-lg flex items-center justify-center'>
                        <span className='text-white font-bold text-sm'>Q</span>
                    </div>
                    <span className='font-semibold text-gray-900 text-lg tracking-tight'>QuickBlog</span>
                </div>

                {/* Right side */}
                <div className='flex items-center gap-3'>
                    {user ? (
                        <div className='relative' ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(prev => !prev)}
                                className='flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary/40 hover:bg-primary/3 transition-all text-sm cursor-pointer'
                            >
                                <div className='w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold'>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className='max-sm:hidden text-gray-700 font-medium'>{user.name}</span>
                                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className='absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden'>
                                    <div className='px-4 py-3 bg-gray-50 border-b border-gray-100'>
                                        <p className='text-xs text-gray-400 mb-0.5'>Signed in as</p>
                                        <p className='text-sm font-medium text-gray-800 truncate'>{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => { setDropdownOpen(false); navigate('/user') }}
                                        className='w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2'
                                    >
                                        <svg className='w-4 h-4 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                            <path strokeLinecap='round' strokeLinejoin='round' d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                                        </svg>
                                        My Dashboard
                                    </button>
                                    <button
                                        onClick={() => { setDropdownOpen(false); logoutUser() }}
                                        className='w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-2'
                                    >
                                        <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                            <path strokeLinecap='round' strokeLinejoin='round' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => navigate('/login')}
                                className='text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all cursor-pointer font-medium'
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className='text-sm bg-primary text-white rounded-lg px-4 py-2 cursor-pointer hover:bg-primary/90 transition-all font-medium shadow-sm shadow-primary/20'
                            >
                                Get started
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar