import React, { useState } from 'react'
import { Link } from 'react-router-dom'


const LandingPage = () => {
    function isValidEmail(email) {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(email);
            }

    const [showOTPInput,setshowOTPInput] = useState(false);
    const handleButton = ()=>{
        // firstly verify the input that is here email 
        const email =  document.getElementById("email")?.ariaValueMax.trim();
        if(!email){
            alert("Email cannot be empty");
        }else{
            const res = isValidEmail(email);
            if(!res){
                alert("Please enter a valid email address");
            }

        }
        if(showOTPInput){
            // matlab get otp pe click kiya hai so 
            

        }else{
            // matlab otp pe click kiya hai 

            
                 
        }
    } 

  return (

    // main container
   <div className='landingPageContainer flex max-w-full h-screen m-1  border-2 border-gray-600 rounded-s-3xl px-1 py-1 gap-9 justify-center'>
       
        {/* // container 1 */}
        <div className='leftContainer flex flex-col w-[40%]'>

         {/* all the content of left side inside this container */}
            <div className='leftContent p-8 w-[85%] '>
                
                {/* 1. icon part */}
                <div className='icon w-full'>
                    <img src="./top.png" alt="hd icon" />
                </div>

                {/* 2.signup part */}
                <div className='signup  mt-32 mx-auto  ml-36 '>
                    <div className='signupTexts w-full '>
                        <div className='heading mb-3 text-3xl font-bold'> 

                            <h1> Sign in</h1>

                        </div>
                        <div className='lineContent font-thin'>
                            <p className='font-inter'>Please login to continue your acoount. </p>
                        </div>
                    </div>
                    <div className='signupForm w-full mb-2'>
                        <form className='flex flex-col gap-2 mt-6 mb-2'>
                        
                            
                           
                            <input type="text"  placeholder='email'  id= "email" className='p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
                            {showOTPInput &&<input type="password"  placeholder='OTP' className='p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />}
                           
                            <button className='bg-blue-500 rounded-md p-2 text-white' onClick={handleButton}> {showOTPInput ? 'Get OTP' : 'Sign in'}</button>
                        </form>
                        <p className='mt-6 ml-5'> Need an account? <Link to='/'  className='text-blue-600 font-medium underline'>Create one</Link></p>
                    </div>
                </div>

            </div>

        </div>


        {/* container 2 */}
        <div className='rightContainer w-3/5 ml-9  flex h-full'>
            {/* all the right side content */}
            <div className='imageContainer'>
                <img src="./wallpaper.png" alt="background" className='w-full h-full object-cover'  />
            </div>

        </div>

   </div> 
  )
}
export default LandingPage