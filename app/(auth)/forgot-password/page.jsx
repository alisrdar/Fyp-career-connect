"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/forgot-password", { email });

      if (res.data.success) {
        setMsg("Reset link sent to your email 📬");
      } else {
        setError(res.data.error || "Something went wrong.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/images/signbg2.jpg')] bg-cover bg-center p-4">
      <div className="w-full max-w-md bg-white/20 p-8 rounded-xl shadow-lg backdrop-blur-md text-white">
        <h1 className="text-2xl font-bold text-center mb-4">Forgot Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 rounded bg-white text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-white"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {msg && <p className="text-green-400 text-sm text-center">{msg}</p>}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>

        <p className="text-sm text-center mt-4 text-white/80">
          Remembered your password?{" "}
          <Link href="/login" className="text-blue-300 underline">
            Go back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
