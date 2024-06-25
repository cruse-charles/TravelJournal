import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

const Header = () => {

  const { currentUser } = useSelector(state => state.user);

  return (
    <header className=''>
      <div className=''>
        <Link to='/'>
          <h1 className=''>
            <span className="">Travel Journal</span>
          </h1>
        </Link>
        <ul className=''>
          <Link to='/'>
            <li className='' >Home</li>
          </Link>
          <Link to='/about'>
            <li className=''>About</li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (<div>{currentUser.username}</div>) : (
              <li className=''>Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header >
  )
}

export default Header