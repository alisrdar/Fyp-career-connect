"use client"
import React from 'react'
import AuthForm from '@/components/forms/AuthForm'
import { emailValidation, nameValidation, passwordValidation } from '@/lib/validateForm'

const page = () => {

  
  const delay = (d) =>{
    return new Promise((resolve,reject) =>{
      setTimeout(() => {
        resolve()
      }, d*1000);
    })
  }

  // page component
const onSubmit = async (data, setError) => {
  try {
    await delay(2);
    console.log(data);
    if (data.name === "asim") { // Corrected from data.username
      setError("blocked", {
        type: "manual",
        message: "Nikal loray, pehli fursat mein nikal"
      });
    }
  } catch (err) {
    setError("root", {
      message: "Email is already taken",
    });
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
        title="Create your account"
        btnText="Sign Up"
        fields={fields}
        onSubmit={onSubmit}
        redirectText="Already have an account?"
        redirectHref="/login"
        onSuccess={() => reset()} // Reset the form on success
      />
      
    </div>
  )
}

export default page
