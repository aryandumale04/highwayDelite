import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';              // runtime import only
import type { AxiosResponse } from 'axios'; // type-only import for TS
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

const SignInPage: React.FC = () => {
  const [generatedOTP, setGeneratedOTP] = useState<string>("");
  const [showOTPInput, setShowOTPInput] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");    
  const [successMessage, setSuccessMessage] = useState<string>(""); 
  const [message, setMessage] = useState<string>(""); 
  const navigate = useNavigate();

  const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setMessage("");

    const emailInput = document.getElementById("email") as HTMLInputElement;
    const email = emailInput?.value.trim() || "";

    if (!email) return setErrorMessage("Email cannot be empty");
    if (!isValidEmail(email)) return setErrorMessage("Please enter a valid email address");

    try {
      if (showOTPInput) {
        // Verify OTP
        const res: AxiosResponse = await axios.post("https://highwaydelite-28qp.onrender.com/verify-otp-signin", {
          email,
          otp: generatedOTP
        });
        if (res.status === 200) {
          if (res.data.token) localStorage.setItem("token", res.data.token);
          setGeneratedOTP("");
          setShowOTPInput(false);
          setSuccessMessage(res.data.message || "Signed in successfully!");
          setMessage("");
          setTimeout(() => navigate("/userPage"), 1500); 
        }
      } else {
        // Generate OTP
        const res: AxiosResponse = await axios.post("https://highwaydelite-28qp.onrender.com/generate-otp-signin", { email });
        if (res.status === 200) {
          setShowOTPInput(true);
          setMessage(`Your OTP is: ${res.data.otp}`);
          setSuccessMessage("OTP generated successfully!");
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleGoogleLogin = async (response: CredentialResponse) => {
    setErrorMessage("");
    setSuccessMessage("");
    setMessage("");
    try {
      if (!response.credential) return setErrorMessage("Google login failed!");

      const res: AxiosResponse = await axios.post("https://highwaydelite-28qp.onrender.com/google-signin", {
        idToken: response.credential
      });

      localStorage.setItem("token", res.data.token);
      setSuccessMessage("Signed in with Google successfully!");
      setTimeout(() => navigate("/userPage"), 1500);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className='landingPageContainer flex flex-col md:flex-row max-w-full h-screen m-1 border-2 border-gray-600 rounded-3xl px-1 py-1 gap-6 justify-center overflow-hidden'>
      {/* Left container */}
      <div className='leftContainer flex flex-col w-full md:w-[44%]'>
        <div className='leftContent p-6 md:p-8 w-full md:w-[85%] mx-auto'>
          {/* Icon */}
          <div className="w-full flex justify-center md:justify-start md:ml-0 mb-2 ml-40 pl-4 md:pl-0">
            <img 
              src="./top.png" 
              alt="hd icon" 
              className="w-full h-auto object-contain" 
            />
          </div>

          {/* Sign in */}
          <div className='signup mt-10 md:mt-32 mx-auto md:ml-36 w-full'>
            <div className='signupTexts text-center md:text-left'>
              <div className='heading mb-3 text-2xl md:text-3xl font-bold'>
                <h1>Sign in</h1>
              </div>
              <div className='lineContent font-thin'>
                <p className='font-inter'>Please login to continue your account.</p>
              </div>
            </div>

            <div className='signupForm w-full mb-2'>
              <form className='flex flex-col gap-2 mt-6 mb-2'>
                <input 
                  type="text" 
                  placeholder='Email' 
                  id="email" 
                  className='p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                />

                {showOTPInput &&
                  <input 
                    type="password" 
                    placeholder='OTP' 
                    className='p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    onChange={(e) => setGeneratedOTP(e.target.value)} 
                  />
                }

                <button className='bg-blue-500 rounded-md p-2 text-white' onClick={handleButton}>
                  {showOTPInput ? 'Sign in' : 'Get OTP'}
                </button>

                {/* Google Login Button */}
                <div className='flex justify-center mt-4'>
                  <GoogleLogin onSuccess={handleGoogleLogin} onError={() => setErrorMessage("Google Login Failed")} />
                </div>
              </form>

              {/* Display messages */}
              {errorMessage && (
                <div className="mt-4 p-2 text-sm text-red-600 bg-red-100 border border-red-400 rounded-md text-center">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="mt-2 p-2 text-sm text-green-700 bg-green-100 border border-green-400 rounded-md text-center">
                  {successMessage}
                </div>
              )}
              {message && (
                <div className="mt-2 p-2 text-sm text-blue-700 bg-blue-100 border border-blue-400 rounded-md text-center">
                  {message}
                </div>
              )}

              <p className='mt-6 text-center'>
                Need an account? <Link to='/' className='text-blue-600 font-medium underline'>Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right container */}
      <div className='rightContainer hidden md:flex w-[56%] ml-0 md:ml-9 h-full justify-center'>
        <div className='imageContainer w-[90%] md:w-[75%]'>
          <img src="./wallpaper.png" alt="background" className='w-full h-full object-cover rounded-lg' />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
