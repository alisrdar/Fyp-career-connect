"use client"
import React, { useState } from 'react'
import AuthForm from '@/components/forms/AuthForm'
import { emailValidation, nameValidation, passwordValidation } from '@/lib/validateForm'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

const SignupPage = () => {
  const router = useRouter()
  // SignupPage component

  const onSubmit = async (data, setError) => {
    try {
      await axios.post("/api/auth/signup", data);
      toast.success("Sign Up successful!");
      router.push("/login");
      return true;     // signal success
    } 
    catch (err) {
      const message = err.response?.data?.error || "Sign Up failed";
      if (message.toLowerCase().includes("email")) {
        setError("email", { type: "manual", message });
      } else {
        setError("formError", { type: "manual", message });
      }
      return false;    // signal failure
    }
  };
  
  
  

  const fields = [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter your name",
      validation: nameValidation,
    },
    {
      label: "Email",
      name: "email",
      type: "text",
      placeholder: " your email@example.com",
      validation: emailValidation,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      validation: passwordValidation,
    },
  ]
  return (
    <div className='flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark bg-[url("/images/signbg2.jpg")] bg-cover bg-center'>
      <AuthForm
        title="Sign Up"
        btnText="Sign Up"
        fields={fields}
        onSuccess={()=>{}}
        onSubmit={onSubmit}
        redirectText="Already have an account?"
        redirectHref="/login" 
        redirectLinkText={"Login"}
      />
    </div>
  )
}

export default SignupPage
