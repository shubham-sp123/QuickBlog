import { createContext, useContext, useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [userToken, setUserToken] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [input, setInput] = useState("")

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get('/api/blog/all')
            data.success ? setBlogs(data.blogs) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const loginUser = (userData, uToken) => {
        setUser(userData)
        setUserToken(uToken)
        localStorage.setItem('userToken', uToken)
        localStorage.setItem('user', JSON.stringify(userData))
        axios.defaults.headers.common['userauthorization'] = uToken
    }

    const logoutUser = () => {
        setUser(null)
        setUserToken(null)
        localStorage.removeItem('userToken')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common['userauthorization']
        toast.success('Logged out successfully')
        navigate('/')
    }

    useEffect(() => {
        fetchBlogs()
        const savedUserToken = localStorage.getItem('userToken')
        const savedUser = localStorage.getItem('user')
        if (savedUserToken && savedUser) {
            setUserToken(savedUserToken)
            setUser(JSON.parse(savedUser))
            axios.defaults.headers.common['userauthorization'] = savedUserToken
        }
    }, [])

    const value = {
        axios, navigate,
        user, setUser,
        userToken, setUserToken,
        loginUser, logoutUser,
        blogs, setBlogs,
        input, setInput
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)