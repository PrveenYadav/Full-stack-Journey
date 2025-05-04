import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice' //Renaming file for this component
import { Button, Input, Logo } from "./index"
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { useForm } from 'react-hook-form' //useForm hook from react-hook-form package which we downloaded

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {register, handleSubmit} = useForm(); //handleSubmit is keyword/event here so not a function,and if you have to make handleSubmit method/function then make it with another name
    const [error, setError] = useState("");

    const login = async(data) => {
        setError("");
        try {
            const session = await authService.login(data)
            if(session) {
                const userData = await authService.getCurrentUser();
                if(userData) dispatch(authLogin(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className='flex items-center justify-center w-full'>
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
            <div className="mb-2 flex justify-center">
                <span className='inline-block w-full max-w-[100px]'>
                    <Logo width='100%'/>
                </span>
            </div>
            <h2 className='text-center text-2xl font-bold'>Sign in to your accont</h2>
            <p className='mt-2 text-center text-base text-black/60'>
                Don&apos;t have any account?&nbsp;
                <Link
                    to="/signup"
                    className='font-medium text-primary transition-all duration-200 hover:underline'
                >
                    Sign Up
                </Link>
            </p>
            {/* if error will true then <p> will work if false then it'll not work */}
            {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
            
            {/* here handle submit it not a function/method it is now a keyword */}
            <form onSubmit={handleSubmit(login)} className='mt-8'>
                <div className="space-y-5">
                    <Input
                        label="Email: "
                        placeholder="Enter your email"
                        type="email"
                        {...register("email", {
                            required: true,
                            validate: { //refer to notes.md file for regexp and it's optional 
                                matchPattern: (value) =>
                                    /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(value) ||
                                    "Email address must be a valid address",
                            }
                        })}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required: true,
                        })}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                    >Sign in</Button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login