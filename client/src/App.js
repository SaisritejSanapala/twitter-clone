import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProfileDetails from './components/ProfileDetails';
import TweetDetails from './components/TweetDetails';
import MyProfile from './pages/MyProfile';



function App() {

  function DynamicRouting() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {//when user has a login active session
        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
        navigate('/')

      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGIN_ERROR" });
        navigate("/login");
      }

    }, []);

    return (
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/register' element={<Register />} />
        <Route exact path='/tweet/:tweetId' element={<TweetDetails />} />
        <Route exact path="/profile/:userId" element={<ProfileDetails />} />
        <Route exact path="/myprofile" element={<MyProfile />} />
      </Routes>
    )

  }

  return (
    <div>
      <Router>
        <DynamicRouting />
      </Router>
    </div>
  );

}

export default App;
