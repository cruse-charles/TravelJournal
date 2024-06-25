import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Flex, Button, Container } from '@mantine/core';

const Header = () => {

  const { currentUser } = useSelector(state => state.user);

  return (
    <Flex
      align="center"
      direction="row"
      wrap="wrap"
    >
      <Container style={{ width: '55%' }} align='left'>
        <Button component={Link} to="/">
          <div>Travel Journal</div>
        </Button>
      </Container>
      <Container style={{ width: '35%' }} align='right'>
        <Button component={Link} to="">
          <div >Home</div>
        </Button>
        <Button component={Link} to="/about">
          <div>About</div>
        </Button>
        <Button component={Link} to="/profile">
          {currentUser ? (<div>{currentUser.username}</div>) : (
            <div>Sign in</div>
          )}
        </Button>
      </Container>
    </Flex>
  )
}

export default Header