// importing basic libraries required
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const LandingPage = () => {
  const [showOTPInput, setOTPInput] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState("");
  const navigate = useNavigate();

  const handleGetOTP = async () => {
    const Name = document.getElementById("name-input").value.trim();
    const email = document.getElementById("email").value.trim();
    const dob = document.getElementById("DOB").value.trim();

    function isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }

    if (!Name) return alert("Please enter your name!");
    if (!dob) return alert("Please enter the date of birth");
    if (!email) return alert("Please enter your email!");
    if (!isValidEmail(email)) return alert("Please enter a valid email.");

    try {
      if (!showOTPInput) {
        const res = await axios.post("http://localhost:5000/generate-otp-signup", {
          name: Name,
          email,
          dob
        });
        alert(`Your OTP is: ${res.data.otp}`);
        setOTPInput(true);
      } else {
        const res = await axios.post("http://localhost:5000/verify-otp-signup", {
          email,
          otp: enteredOTP
        });
        localStorage.setItem("token", res.data.token);
        setEnteredOTP("");
        setOTPInput(false);
        navigate("/userPage");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      if (!response.credential) return alert("Google login failed!");

      const res = await axios.post("http://localhost:5000/google-signup", {
        idToken: response.credential
      });

      localStorage.setItem("token", res.data.token);
      navigate("/userPage");
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className='landingPageContainer flex flex-col md:flex-row max-w-full h-screen m-1 border-2 border-gray-600 rounded-3xl px-1 py-1 gap-6 justify-center overflow-hidden'>


      {/* Left container */}
      <div className='leftContainer flex flex-col w-full md:w-[44%]'>
        <div className='leftContent p-6 md:p-8 w-full md:w-[85%] mx-auto'>

          {/* Icon */}
         {/* 1. icon part */}
{/* 1. icon part */}
{/* 1. icon part */}
{/* Icon */}
{/* Icon */}
{/* Icon */}
<div className="w-full flex justify-center md:justify-start md:ml-0 mb-2 ml-40 pl-4 md:pl-0">
  <img 
    src="./top.png" 
    alt="hd icon" 
    className="w-full h-auto object-contain" 
  />
</div>








          {/* Signup */}
          <div className='signup mt-10 md:mt-32 mx-auto md:ml-36 w-full'>
            <div className='signupTexts text-center md:text-left'>
              <div className='heading mb-3 text-2xl md:text-3xl font-bold'>
                <h1>Sign up</h1>
              </div>
              <div className='lineContent font-thin'>
                <p className='font-inter'>Sign up to access the features of HD</p>
              </div>
            </div>

            <div className='signupForm w-full mb-2'>
              <form className='flex flex-col gap-2 mt-6 mb-2'>
                <input type="text" id="name-input" placeholder='Your Name' className='p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />

                <div className='dateInput flex items-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'>
                  <img src="/cal.png" className='ml-2 h-6' alt="calendar" />
                  <input type="text" id="DOB" placeholder='Date of Birth' className='p-2 flex-1 focus:outline-none' />
                </div>

                <input type="text" id="email" placeholder='Email' className='p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />

                {showOTPInput &&
                  <input type="password" placeholder='OTP' onChange={(e) => setEnteredOTP(e.target.value)} className='p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
                }

                <div className='flex flex-col gap-2'>
                  <button type="button" onClick={handleGetOTP} className='bg-blue-500 rounded-md p-2 text-white'>
                    {showOTPInput ? 'Sign up' : 'Get OTP'}
                  </button>

                  <div className='flex justify-center mt-4'>
                    <GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert("Google Login Failed")} />
                  </div>
                </div>
              </form>

              <p className='mt-6 text-center md:text-left'>
                Already have an account? <Link to="/signInPage" className='font-medium underline text-blue-600'>Sign in</Link>
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

export default LandingPage;
