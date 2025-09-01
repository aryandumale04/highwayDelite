import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import SignInPage from './Components/SignIn';
import UserPage from './Components/UserPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signInPage" element={<SignInPage />} />
        <Route path="/userPage" element={<UserPage />} />
      </Routes>
    </Router>
  );
};

export default App;
