import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutFailure, signOutSuccess, signOutStart } from '../redux/user/userSlice.js'

import { Flex, Button, Container, Menu } from '@mantine/core';
import styles from './Header.module.css'

const Header = () => {

  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleProfileClick = () => {
    navigate('/profile')
  }

  const handleSignUpClick = () => {
    navigate('/signup')
  }

  const handleLogout = async () => {
    // Dispatch signOutStart action of userSlice to indicate that the sign out process has started
    dispatch(signOutStart());

    // GET request to logout endpoint
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

  // Display the header with the appropriate buttons based on whether the user is logged in or not
  return (
    <Flex
      align="center"
      direction="row"
      wrap="wrap"
      className={styles.headerContainer}
    >
      <Container className={styles.travelJournalButtonContainer} >
        <Button component={Link} to="/" color="black">TravelJournal</Button>
      </Container>
      <Container className={styles.homeButtonContainer}>
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
              <Menu.Item onClick={handleProfileClick}>
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