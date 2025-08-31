import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const SignInPage = () => {
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const navigate = useNavigate();

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const handleButton = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();

    if (!email) return alert("Email cannot be empty");
    if (!isValidEmail(email)) return alert("Please enter a valid email address");

    try {
      if (showOTPInput) {
        // verify OTP
        const res = await axios.post("http://localhost:5000/verify-otp-signin", {
          email,
          otp: generatedOTP
        });
        if (res.status === 200) {
          if (res.data.token) localStorage.setItem("token", res.data.token);
          alert(res.data.message || "Signed in Successfully");
          setGeneratedOTP("");
          setShowOTPInput(false);
          navigate("/userPage");
        }
      } else {
        // generate OTP
        const res = await axios.post("http://localhost:5000/generate-otp-signin", { email });
        if (res.status === 200) {
          alert(`Your OTP is: ${res.data.otp}`);
          setShowOTPInput(true);
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      if (!response.credential) return alert("Google login failed!");

      const res = await axios.post("http://localhost:5000/google-login", {
        idToken: response.credential
      });

      localStorage.setItem("token", res.data.token);
      navigate("/userPage");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Google login failed");
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
                <input type="text" placeholder='Email' id="email" className='p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />

                {showOTPInput &&
                  <input type="password" placeholder='OTP' className='p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    onChange={(e) => setGeneratedOTP(e.target.value)} />
                }

                <button className='bg-blue-500 rounded-md p-2 text-white' onClick={handleButton}>
                  {showOTPInput ? 'Sign in' : 'Get OTP'}
                </button>

                {/* Google Login Button */}
                <div className='flex justify-center mt-4'>
                  <GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert("Google Login Failed")} />
                </div>
              </form>

              <p className='mt-6 text-center md:text-left'>
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
