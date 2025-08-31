// importing basic libraries required
import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import axios from 'axios';



const LandingPage = () => {



    // state management 
   
    const [showOTPInput,setOTPInput] = useState(false);
    const [enteredOTP,setEnteredOTP] = useState("");
    const navigate = useNavigate();

  

        

    const handleGetOTP=  async  ()=>{
        // fetching the inputs 
       const Name = document.getElementById("name-input").value.trim();
       const email= document.getElementById("email").value.trim();
       const dob= document.getElementById("DOB").value.trim();

       



       function isValidEmail(email) {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(email);
            }
       

       // validating the inputs

    //    1.Name
       if(Name === ""){
        alert("Please enter your name !");
        return ;
       }



   

    //    2.DateofBirth

       if(dob === ""){
        alert("Please enter the date of birth");
        return ;
       }



        //    3.Email
       if(email === ""){
                alert("Please enter your email!");
                return ;
       } else {
                const emailCheck= isValidEmail(email);
                if(!emailCheck){
                     alert("Please enter a valid email.");
                     return ;

                }
            }


       // all the inputs are valid 
       

       // otp generation 
       if(!showOTPInput){
        // generate the code  USING BACKEND
            try{

                const res = await axios.post("http://localhost:5000/generate-otp-signup",{

                    name : Name,
                    email : email,
                    dob: dob
                });
                alert(`Your OTP is :${res.data.otp} `); // success message
                setOTPInput(true);

            }catch(err :  any){

                alert(err.response?.data?.message || "Server error");

            }
            
       }else{
        // verify the otp  USING BACKEND
       
            try{
                 const res= await axios.post('http://localhost:5000/verify-otp-signup',{
                    email: email ,
                    otp: enteredOTP
                });
                localStorage.setItem('token',res.data.token);
                setEnteredOTP("");   
                setOTPInput(false);
                navigate('/userPage');
            
            }catch(err : any ){
                alert(err.response?.data?.message || "Server error");
            }
               
       }


       


    }









    // UI part
  return (

    // main container
   <div className='landingPageContainer flex max-w-full h-screen m-1  border-2 border-gray-600 rounded-s-3xl px-1 py-1 gap-9 justify-center'>
       
        {/* // container 1 */}
        <div className='leftContainer flex flex-col w-[44%]'>

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
                                <input type="text" id="DOB" placeholder='Date of Birth' className='p-2 focus:outline-none' />
                            </div>
                            <input type="text" id="email" placeholder='email' className='p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
                            {showOTPInput &&<input type="password"  placeholder='OTP' onChange={(e)=>{
                                setEnteredOTP(e.target.value);
                            }} className='p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />}
                            <button  type= "button" onClick= {handleGetOTP} className='bg-blue-500 rounded-md p-2 text-white '> { showOTPInput ? 'Sign up' : 'Get OTP'}</button>
                        </form>
                        <p className='mt-6 ml-5'> Already have an account?? <Link to="/signInPage" className='font-medium underline text-blue-600'>Sign in</Link></p>
                    </div>
                </div>

            </div>

        </div>


        {/* container 2 */}
        <div className='rightContainer w-[56%] ml-9  flex h-full justify-center'>
            {/* all the right side content */}
            <div className='imageContainer  w-[75%]'>
                <img src="./wallpaper.png" alt="background" className='w-full h-full object-cover rounded-lg'  />
            </div>

        </div>

   </div> 
  )
}
export default LandingPage