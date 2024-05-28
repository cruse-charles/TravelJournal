import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center mas-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className="text-slate-500">Travel Journal</span>
          </h1>
        </Link>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='text-slate-700 hover:underline' >Home</li>
          </Link>
          <Link to='/about'>
            <li className='text-slate-700 hover:underline'>About</li>
          </Link>
          <Link to='/signup'>
            <li className='text-slate-700 hover:underline'>Sign in</li>
          </Link>
        </ul>
      </div>
    </header >
  )
}

export default Header