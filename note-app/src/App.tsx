import React from 'react'
import LandingPage from './Components/LandingPage'
import SignInPage from './Components/SignIn'
import UserPage from './Components/UserPage'

import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path='/signInPage' element={<SignInPage/>}></Route>
        <Route path='/userPage' element ={<UserPage></UserPage>}></Route>

       
      </Routes>
    </Router>
   
  )
}

export default App
