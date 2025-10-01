import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import {Toaster} from 'react-hot-toast' 
import { AuthContext } from '../context/AuthContext.jsx'

const App = () => {
  const {authUser, isLoading}=React.useContext(AuthContext)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[url('/bgImage.svg')] 
    bg-contain">
      <Toaster />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App
