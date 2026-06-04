import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'

function Login() {
    const { axios, loginUser, navigate } = useAppContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.post('/api/user/login', { email, password })
            if (data.success) {
                loginUser(data.user, data.token)
                toast.success('Welcome back, ' + data.user.name + '!')
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
                <div className='flex flex-col items-center justify-center'>
                    <img onClick={() => navigate('/')} src={assets.logo} className='w-32 sm:w-40 cursor-pointer mb-4' alt="" />
                    <h1 className='text-2xl font-bold'>Welcome <span className='text-primary'>Back</span></h1>
                    <p className='font-light text-sm text-gray-500 mt-1'>Login to your account</p>
                    <form onSubmit={handleSubmit} className='mt-6 w-full text-gray-600'>
                        <div className='flex flex-col'>
                            <label className='text-sm mb-1'>Email</label>
                            <input onChange={e => setEmail(e.target.value)} value={email} type="email" required placeholder='your@email.com' className='border-b-2 border-gray-300 p-2 outline-none mb-5 focus:border-primary transition-colors' />
                        </div>
                        <div className='flex flex-col'>
                            <label className='text-sm mb-1'>Password</label>
                            <input onChange={e => setPassword(e.target.value)} value={password} type="password" required placeholder='your password' className='border-b-2 border-gray-300 p-2 outline-none mb-6 focus:border-primary transition-colors' />
                        </div>
                        <button type='submit' disabled={loading} className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-70'>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <p className='text-center text-sm text-gray-500 mt-4'>
                            Don't have an account?{' '}
                            <span onClick={() => navigate('/register')} className='text-primary cursor-pointer hover:underline font-medium'>Sign up</span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login