"use client"
import React from 'react'
import AuthForm from '@/components/forms/AuthForm'
import { emailValidation, nameValidation, passwordValidation } from '@/lib/validateForm'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const page = () => {
    const fields = [
        {
            label: "Email",
            name: "email",
            type: "text",
            placeholder: " yourEmail@gmail.com",
            validation: emailValidation,
        },
        {
            label: "Password",
            name: "password",
            type: "password",
            placeholder: "Enter your password",
            validation: passwordValidation,
        }
    ];
    const router = useRouter()
    const { login, user } = useAuth()
    const onLogin = async (data, setError) => {
        try{
            const ok = await login(data)
            if (!ok) {
              throw new Error("Login failed")
            }
            
            console.log("[Login Page] Login successful, letting middleware handle redirect");
            
            // Force a full page reload to trigger middleware
            window.location.href = "/";
            
            return true; // signal success
        } catch(err){
          console.log("login failed", err);
          const message = err.response?.data?.error || err.message || "Login failed";
            setError("formError", { type: "manual", message });
          return false;
        }
      };
  return (
    <div className='flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark bg-[url("/images/signbg2.jpg")] bg-cover bg-center'>
        <AuthForm
            title="Login"
            btnText="Login"
            fields={fields}
            redirectText={"Don't have an account?"}
            redirectHref={"signup"}
            onSubmit={onLogin}
            redirectLinkText={"Sign Up"}
        /> 
    </div>
  )
}

export default page
