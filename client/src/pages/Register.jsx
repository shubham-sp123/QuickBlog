import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'

function Register() {
    const { axios, loginUser, navigate } = useAppContext()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.post('/api/user/register', { name, email, password })
            if (data.success) {
                loginUser(data.user, data.token)
                toast.success('Welcome, ' + data.user.name + '!')
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
                    <h1 className='text-2xl font-bold'>Create <span className='text-primary'>Account</span></h1>
                    <p className='font-light text-sm text-gray-500 mt-1'>Join us today, it's free!</p>
                    <form onSubmit={handleSubmit} className='mt-6 w-full text-gray-600'>
                        <div className='flex flex-col'>
                            <label className='text-sm mb-1'>Full Name</label>
                            <input onChange={e => setName(e.target.value)} value={name} type="text" required placeholder='John Doe' className='border-b-2 border-gray-300 p-2 outline-none mb-5 focus:border-primary transition-colors' />
                        </div>
                        <div className='flex flex-col'>
                            <label className='text-sm mb-1'>Email</label>
                            <input onChange={e => setEmail(e.target.value)} value={email} type="email" required placeholder='your@email.com' className='border-b-2 border-gray-300 p-2 outline-none mb-5 focus:border-primary transition-colors' />
                        </div>
                        <div className='flex flex-col'>
                            <label className='text-sm mb-1'>Password</label>
                            <input onChange={e => setPassword(e.target.value)} value={password} type="password" required placeholder='min. 6 characters' className='border-b-2 border-gray-300 p-2 outline-none mb-6 focus:border-primary transition-colors' />
                        </div>
                        <button type='submit' disabled={loading} className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-70'>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                        <p className='text-center text-sm text-gray-500 mt-4'>
                            Already have an account?{' '}
                            <span onClick={() => navigate('/login')} className='text-primary cursor-pointer hover:underline font-medium'>Login</span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register