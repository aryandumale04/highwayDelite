import React from 'react'
import LandingPage from './Components/LandingPage'
import SignInPage from './Components/SignIn'

import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path='/signInPage' element={<SignInPage/>}></Route>

       
      </Routes>
    </Router>
   
  )
}

export default App
