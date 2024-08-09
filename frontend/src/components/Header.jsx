import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Flex, Button, Container, Text, Menu } from '@mantine/core';

const Header = () => {

  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile')
  }

  return (
    <Flex
      align="center"
      direction="row"
      wrap="wrap"
      style={{ backgroundColor: 'black', height: '100%', padding: '0px' }}
    >
      <Container style={{ width: '55%' }} align='left' >
        <Button component={Link} to="/" color="black">TravelJournal</Button>
      </Container>
      <Container style={{ width: '35%' }} align='right'>
        <Button component={Link} to="" color="black">Home</Button>





        <Menu>
          <Menu.Target>
            {currentUser ? (<Button color="black">{currentUser.username}</Button>) : (<Button onClick={handleProfileClick} color='black'>Login/Sign Up</Button>)}
          </Menu.Target>
          {currentUser ? (
            <Menu.Dropdown>
              <Menu.Item onClick={handleProfileClick}>
                Profile
              </Menu.Item>
              <Menu.Item>
                Logout
              </Menu.Item>
              <Menu.Divider />
              <Menu.Label>
                Danger zone
              </Menu.Label>
              <Menu.Item color='red'>
                Delete Account
              </Menu.Item>
            </Menu.Dropdown>
          ) : (
            <Menu.Dropdown>
              <Menu.Item onClick={handleProfileClick}>
                Login
              </Menu.Item>
              <Menu.Item>
                Sign Up
              </Menu.Item>
            </Menu.Dropdown>
          )}
        </Menu>
      </Container>
    </Flex >
  )
}

export default Header