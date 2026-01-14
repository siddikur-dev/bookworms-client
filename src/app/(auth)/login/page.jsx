'use client';

import React, { useContext, useState } from "react";
import { AuthContext } from "@/providers/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { LogIn, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithMailPass, signInGoogle } = useContext(AuthContext);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("redirect") || "/library";

  // Function to save/check user in MongoDB (same as Register)
  const saveUserToDatabase = async (user) => {
    try {
      const userInfo = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      };
      await axios.post("http://localhost:5000/users", userInfo);
    } catch (error) {
      console.error("Error updating user in DB:", error);
    }
  };

  // 1. Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInWithMailPass(email, password);
      
      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "Logged in successfully.",
        showConfirmButton: false,
        timer: 1500,
      });

      router.push(from);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInGoogle();
      // গুগল দিয়ে লগইন করলেও আমরা ডেটাবেসে ইউজার ইনফো পাঠিয়ে রাখি (Upsert logic in backend)
      await saveUserToDatabase(result.user);

      Swal.fire({
        icon: "success",
        title: "Google Login Successful",
        showConfirmButton: false,
        timer: 1500,
      });
      router.push(from);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not sign in with Google.",
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="bg-card border border-border shadow-2xl rounded-3xl w-full max-w-md p-8 md:p-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-secondary/10 text-secondary mb-4">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-2 tracking-tight">Login to BookWorm</h2>
          <p className="text-foreground/60 text-sm font-medium">Continue your reading journey</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/80 ml-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              className="input-field" 
              placeholder="reader@example.com" 
              required 
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold text-foreground/80">Password</label>
              {/* <button type="button" className="text-xs font-bold text-secondary hover:underline">Forgot?</button> */}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-field pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VscEyeClosed size={22} /> : <VscEye size={22} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full text-lg py-4 shadow-xl shadow-primary/20 disabled:opacity-70 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-3 text-foreground/40 font-bold">Or continue with</span></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border border-border bg-white hover:bg-slate-50 hover:border-primary/30 transition-all active:scale-95 font-bold text-foreground/80"
        >
          <FcGoogle size={24} /> <span>Sign in with Google</span>
        </button>

        <p className="text-center mt-10 text-foreground/60 text-sm">
          Don't have an account? <Link href="/register" className="text-primary font-extrabold hover:underline">Register Now</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;