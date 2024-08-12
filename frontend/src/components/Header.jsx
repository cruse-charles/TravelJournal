import React from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutFailure, signOutSuccess, signOutStart } from '../redux/user/userSlice.js'


import { Flex, Button, Container, Text, Menu } from '@mantine/core';

const Header = () => {

  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginClick = () => {
    navigate('/profile')
  }

  const handleSignUpClick = () => {
    navigate('/signup')
  }

  const handleLogout = async () => {
    dispatch(signOutStart());
    await axios.get('api/auth/logout')
      .then(() => {
        dispatch(signOutSuccess());
      })
      .catch(err => {
        dispatch(signOutFailure(err.response.data.message));
      })
  }

  const handleDeleteUser = async () => {
    // Dispatch deleteUserStart action of userSlice to indicate that the delete process has started
    dispatch(deleteUserStart())

    // DELETE request to delete user endpoint
    await axios.delete(`api/user/delete/${currentUser._id}`)
      .then(res => {
        dispatch(deleteUserSuccess(res.data))
      }).catch(err => {
        dispatch(deleteUserFailure(err.response.data.message))
      })
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
            {currentUser ? (<Button color="black">{currentUser.username}</Button>) : (<Button color='black'>Login/Sign Up</Button>)}
          </Menu.Target>
          {currentUser ? (
            <Menu.Dropdown>
              <Menu.Item onClick={handleProfileClick}>
                Profile
              </Menu.Item>
              <Menu.Item onClick={handleLogout}>
                Logout
              </Menu.Item>
              <Menu.Divider />
              <Menu.Label>
                Danger zone
              </Menu.Label>
              <Menu.Item color='red' onClick={handleDeleteUser}>
                Delete Account
              </Menu.Item>
            </Menu.Dropdown>
          ) : (
            <Menu.Dropdown>
              <Menu.Item onClick={handleLoginClick}>
                Login
              </Menu.Item>
              <Menu.Item onClick={handleSignUpClick}>
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