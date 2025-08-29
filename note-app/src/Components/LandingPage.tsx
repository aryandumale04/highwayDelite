import React from 'react'
import { Link } from 'react-router-dom'


const LandingPage = () => {
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

                            <h1> Sign up</h1>

                        </div>
                        <div className='lineContent font-thin'>
                            <p className='font-inter'>Sign up to access the features of HD</p>
                        </div>
                    </div>
                    <div className='signupForm w-full mb-2'>
                        <form className='flex flex-col gap-2 mt-6 mb-2'>
                        
                            <input type="text" id="name-input" placeholder='Your Name' className='p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
                            
                            <div className='dateInput flex border border-gray-300 rounded-md focus:ring-2 focus: ring-blue-500 '>
                               <img src="/cal.png" className='ml-2 mt-2 h-6'>
                               </img>
                                <input type="text" placeholder='Date of Birth' className='p-2 focus:outline-none' />
                            </div>
                            <input type="text"  placeholder='email' className='p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
                            <input type="password"  placeholder='OTP' className='p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
                            <button className='bg-blue-500 rounded-md p-2 text-white '> Get OTP</button>
                        </form>
                        <p className='mt-6 ml-5'> Already have an account?? <Link to="/signUpPage" className='font-medium underline text-blue-600'>Sign in</Link></p>
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