import React from 'react'
import { useAppContext } from '../context/AppContext'

function Footer() {
    const { navigate } = useAppContext()

    return (
        <footer className='bg-gray-950 text-gray-400'>
            <div className='max-w-6xl mx-auto px-6 md:px-12 pt-16 pb-8'>

                {/* Top section */}
                <div className='flex flex-col md:flex-row gap-12 pb-12 border-b border-gray-800'>

                    {/* Brand + About */}
                    <div className='md:max-w-sm'>
                        <div className='flex items-center gap-2 mb-5 cursor-pointer' onClick={() => navigate('/')}>
                            <div className='w-7 h-7 bg-primary rounded-lg flex items-center justify-center'>
                                <span className='text-white font-bold text-sm'>Q</span>
                            </div>
                            <span className='font-semibold text-white text-lg tracking-tight'>QuickBlog</span>
                        </div>
                        <p className='text-sm text-gray-400 leading-relaxed mb-5'>
                            QuickBlog is an open platform where curious minds come to read, write, and deepen their understanding of the world. Whether you're here to share your expertise, document your journey, or simply explore new ideas — you belong here.
                        </p>
                        <p className='text-sm text-gray-500 leading-relaxed'>
                            Powered by AI tools that help you write better, think clearer, and reach further. Built for writers who have something worth saying.
                        </p>

                        {/* Social icons */}
                        <div className='flex gap-3 mt-6'>
                            {[
                                { label: 'Twitter', href: '#', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                                { label: 'GitHub', href: '#', icon: 'M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z' },
                                { label: 'LinkedIn', href: '#', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                            ].map(s => (
                                <a key={s.label} href={s.href} aria-label={s.label}
                                    className='w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors'>
                                    <svg className='w-4 h-4 text-gray-400' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d={s.icon} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className='flex flex-wrap gap-10 md:ml-auto'>
                        <div>
                            <h4 className='text-white text-sm font-medium mb-4'>Platform</h4>
                            <ul className='space-y-3 text-sm'>
                                {['Home', 'Browse articles', 'Start writing', 'Sign up'].map(link => (
                                    <li key={link}>
                                        <span onClick={() => link === 'Home' ? navigate('/') : link === 'Start writing' || link === 'Sign up' ? navigate('/register') : navigate('/')}
                                            className='hover:text-white transition-colors cursor-pointer'>
                                            {link}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className='text-white text-sm font-medium mb-4'>Categories</h4>
                            <ul className='space-y-3 text-sm'>
                                {['Technology', 'Startup', 'Lifestyle', 'Finance'].map(cat => (
                                    <li key={cat}>
                                        <span onClick={() => navigate('/')} className='hover:text-white transition-colors cursor-pointer'>{cat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className='text-white text-sm font-medium mb-4'>Legal</h4>
                            <ul className='space-y-3 text-sm'>
                                {['Privacy policy', 'Terms of use', 'Cookie policy'].map(link => (
                                    <li key={link}>
                                        <a href='#' className='hover:text-white transition-colors'>{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className='pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600'>
                    <p>© 2025 QuickBlog. All rights reserved.</p>
                    <p>Made with ❤️ for writers everywhere</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer