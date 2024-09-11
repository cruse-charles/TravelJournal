import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MantineProvider, AppShell } from '@mantine/core';

import CreateEntry from './pages/Entry/CreateEntry';
import SingleEntry from './pages/Entry/SingleEntry';
import SignUp from './pages/Signup/SignUp';
import Login from './pages/Login/Login';
import Header from './components/Header';
import PrivateProfileRoute from './components/PrivateProfileRoute';
import Profile from './pages/Profile/Profile.tsx';
import About from './pages/About/About';

import '@mantine/core/styles.css';
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import '@mantine/dropzone/styles.css';


function App() {
  return (
    <MantineProvider>
      <Router>
        <AppShell header={{ height: 60 }}>
          <AppShell.Header>
            <Header />
          </AppShell.Header>
          <AppShell.Main>
            <Routes>
              <Route path="/create" element={<CreateEntry />} />
              <Route path="/entry/:id" element={<SingleEntry />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateProfileRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path='/' element={<About />} />
            </Routes>
          </AppShell.Main>
        </AppShell>
      </Router>
    </MantineProvider >
  );
}

export default App
