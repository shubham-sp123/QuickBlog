import React, { useRef } from "react";
import { useAppContext } from "../context/AppContext";

function Header() {
    const { setInput, input, navigate, user } = useAppContext()
    const inputRef = useRef()

    const onSubmitHandler = (e) => {
        e.preventDefault();
        setInput(inputRef.current.value)
    }

    const onClear = () => {
        setInput('')
        inputRef.current.value = ''
    }

    return (
        <div className="relative overflow-hidden bg-white">
            {/* Subtle background decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-sm font-medium text-primary bg-primary/8 border border-primary/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    AI-powered blogging platform
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-6xl font-semibold text-gray-900 leading-tight sm:leading-tight mb-6">
                    Write, share and
                    <span className="text-primary"> connect</span>
                    <br className="hidden sm:block" /> with the world
                </h1>

                <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
                    Your space to think out loud, share what matters, and write without filters. Join thousands of writers who call QuickBlog home.
                </p>

                {/* Search */}
                <div className="max-w-lg mx-auto">
                    <form onSubmit={onSubmitHandler} className="flex items-center gap-2 p-1.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-primary/30 transition-colors">
                        <svg className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search articles..."
                            required
                            className="flex-1 py-2 px-2 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                        />
                        <button type="submit" className="bg-primary text-white text-sm px-5 py-2 rounded-lg hover:bg-primary/90 transition-all cursor-pointer font-medium">
                            Search
                        </button>
                    </form>

                    {input && (
                        <div className="mt-3 text-center">
                            <button onClick={onClear} className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                                ✕ Clear search "{input}"
                            </button>
                        </div>
                    )}
                </div>

                {/* CTA for non-logged in */}
                {!user && (
                    <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-500">
                        <button onClick={() => navigate('/register')} className="text-primary font-medium hover:underline cursor-pointer">
                            Start writing for free →
                        </button>
                        <span className="text-gray-300">|</span>
                        <span>No credit card required</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header