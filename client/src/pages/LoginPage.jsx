import React from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx'

const LoginPage = () => {
  const [currState, setCurrState] = React.useState('Sign Up') 
  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [bio, setBio] = React.useState('')
  const [isDataSubmitted, setIsDataSubmitted] = React.useState(false)
  const {login}=React.useContext(AuthContext)

  const onSubmithandler = (e) => {
    e.preventDefault();
    if (currState === 'Sign Up' && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    // Prepare credentials based on the current state
    const credentials = currState === 'Sign Up' 
      ? {fullName, email, password, bio} 
      : {email, password};

    login(currState === 'Sign Up' ? 'signup' : 'login', credentials);
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
       <img src={assets.logo_big} alt="logo" className='w-[min(930vw,250px)]'/>
       <form onSubmit={onSubmithandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'> 
       <h2 className='font-medium text-2xl flex justify-between items-center'>
        {currState} 
        {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/>}
        <img src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/>
        </h2>
        {currState === 'Sign Up' && !isDataSubmitted && (
        <input 
        onChange={(e)=>setFullName(e.target.value)} value={fullName} 
        type="text"  className='p-2 border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required/>
        )}

        {!isDataSubmitted && (
          <>
        <input onChange={(e)=>setEmail(e.target.value)} value={email}
        type="email"  className='p-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Email' required/>
        <input onChange={(e)=>setPassword(e.target.value)} value={password}
        type="password"  className='p-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Password' required/>
          </>
        )}

        {
          currState==='Sign Up' && isDataSubmitted && (
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} rows={4} className='p-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Bio' required/>
          )
        }
        <button type='submit' className=' py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currState === 'Sign Up' ? 'Create Account': 'Login'}
        </button>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="Checkbox" />
          <p>Agree To the term or Pay Penalty</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === 'Sign Up' ? (
            <p className='text-sm text-gray-600'>
              Already have an account?{' '}
              <span
                className='font-medium text-violet-500 cursor-pointer'
                onClick={() => { setCurrState('Login'); setIsDataSubmitted(false); }}
              >
                Login
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              Create an account{' '}
              <span
                className='font-medium text-violet-500 cursor-pointer'
                onClick={() => setCurrState('Sign Up')}
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </form>
       
    </div>
  )
}

export default LoginPage
