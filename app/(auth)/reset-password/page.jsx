"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) setToken(urlToken);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/reset-password", {
        token,
        newPassword,
      });
      
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(res.data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Unexpected error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/images/signbg2.jpg')] bg-cover bg-center text-white">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>

      {success ? (
        <p className="text-green-600">✅ Password updated! Redirecting to login...</p>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <input
            type="password"
            className="w-full p-2 border rounded"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Reset Password
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
