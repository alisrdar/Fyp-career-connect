"use client"
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import axios from 'axios'
import { set } from 'mongoose'
import Link from 'next/link'


const VerifyEmailPage = () => {

    // const router = useRouter()

    const [error, setError] = useState(false)
    const [verified, setVerified] = useState(false)
    const [token, setToken] = useState("")
    const verifyEmail = async () =>{
        try{
            await axios.post("/api/auth/verifyemail", {token})
            setVerified(true)
            setError(false)
        } catch(err){
            setError(true)
            console.log("Error in verifying email", err);
        }
    }
    useEffect(() => {
        setError(false)
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || "")

        // const {query} = router;
        // const urlToken2 = query.token
        // setToken(urlToken || "")
    }, []) 

    useEffect(() => {
        setError(false)
        if(token){
            verifyEmail()
        }
    }, [token])
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark bg-[url("/images/signbg2.jpg")] bg-cover bg-center'>
      <h1 className='text-3xl text-foreground-light dark:from-foreground-dark'>Verify Email</h1>
      <h2 className='p-2 bg-secondary'>
        {token ? token : "No token found"}
      </h2>
      {error && <p className='text-red-500'>Error in verifying email</p>}
      {verified && 
        <div>
            <h2 className='text-green-400 text-2xl`'>Email verified successfully</h2>
            <Link href="/login">Login</Link>
        </div>
      }
    </div>
  )
  
}

export default VerifyEmailPage
