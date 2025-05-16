import React from 'react'
import loggedOutAnimation from "../Assets/nrjwS2UVce.gif"

function LoggedOut() {
  return (
    <div className='flex flex-col items-center justify-center bg-[#fafafa] text-2xl text-black font-serif italic h-screen'>
      <img src={loggedOutAnimation} alt="Animation" className='w-[300px] h-[300px]' />
      <p>Looks like you are not signed up. Redirecting to login page... </p>
    </div>
  )
}

export default LoggedOut
