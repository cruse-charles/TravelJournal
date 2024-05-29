import React from 'react'

const Header = () => {
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center mas-w-6xl mx-auto p-3'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
          <span className="text-slate-500">Travel Journal</span>
        </h1>
        <ul className='flex gap-4'>
          <li className='text-slate-700 hover:underline' >Home</li>
          <li className='text-slate-700 hover:underline'>About</li>
          <li className='text-slate-700 hover:underline'>Sign in</li>
        </ul>
      </div>
    </header >
  )
}

export default Header