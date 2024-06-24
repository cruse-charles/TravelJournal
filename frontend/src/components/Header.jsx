import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Flex, Button } from '@mantine/core';

const Header = () => {

  const { currentUser } = useSelector(state => state.user);

  // return (
  //   <Flex mih={50}
  //     gap="md"
  //     justify="flex-end"
  //     align="center"
  //     direction="row"
  //     wrap="wrap">
  //     <div className=''>
  //       <Link to='/'>
  //         <div className=''>
  //           <span className="">Travel Journal</span>
  //         </div>
  //       </Link>
  //       <ul className=''>
  //         <Link to='/'>
  //           <li className='' >Home</li>
  //         </Link>
  //         <Link to='/about'>
  //           <li className=''>About</li>
  //         </Link>
  //         <Link to='/profile'>
  //           {currentUser ? (<div>{currentUser.username}</div>) : (
  //             <li className=''>Sign in</li>
  //           )}
  //         </Link>
  //       </ul>
  //     </div>
  //   </Flex>
  // )

  return (
    <Flex mih={50}
      gap="md"
      justify="flex-end"
      align="center"
      direction="row"
      wrap="wrap">
      <div className=''>
        <Button component={Link} to="/">
          <div className="">Travel Journal</div>
        </Button>
        <Button component={Link} to="">
          <div className='' >Home</div>
        </Button>
        <Button component={Link} to="/about">
          <div className=''>About</div>
        </Button>
        <Button component={Link} to="/profile">
          {currentUser ? (<div>{currentUser.username}</div>) : (
            <div className=''>Sign in</div>
          )}
        </Button>
      </div>
    </Flex>
  )
}

export default Header