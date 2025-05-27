"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const VerifyEmailPage = () => {
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (!urlToken) return;
    setToken(urlToken);

    const verifyEmail = async () => {
      try {
        const res = await axios.post("/api/auth/verifyemail", {
          token: urlToken,
        });

        if (res.data?.success) {
          setVerified(true);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error in verifying email:", err.response?.data || err);
        setError(true);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/images/signbg2.jpg')] bg-cover bg-center text-white">
      <h1 className="text-3xl">Verify Email</h1>
      <p className="mt-2 text-sm bg-white text-black px-4 py-1 rounded">{token || "No token found"}</p>

      {verified && (
        <div className="mt-6 text-green-400">
          <h2>Email verified successfully </h2>
          <Link href="/login" className="text-blue-400 underline block mt-2">
            Go to Login
          </Link>
        </div>
      )}

      {error && (
        <p className="text-red-500 mt-6">
           Error in verifying email. Token may be invalid or expired.
        </p>
      )}
    </div>
  );
};

export default VerifyEmailPage;
