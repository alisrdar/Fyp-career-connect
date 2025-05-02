"use client"
import React from 'react'
import AuthForm from '@/components/forms/AuthForm'
import { emailValidation, nameValidation, passwordValidation } from '@/lib/validateForm'

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
    ]
  return (
    <div className='flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark bg-[url("/images/signbg2.jpg")] bg-cover bg-center'>
        <AuthForm
            title="Login"
            btnText="Login"
            fields={fields}
            redirectText={"Don't have an account? Sign up"}
            redirectHref={"signup"}
        />
        
            
    </div>
  )
}

export default page
