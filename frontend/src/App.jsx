import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MantineProvider, AppShell } from '@mantine/core';

import CreatePage from './components/CreatePage';
import SinglePage from './components/SinglePage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Header from './components/Header';
import PrivateProfileRoute from './components/PrivateProfileRoute';
import Profile from './components/Profile';

import '@mantine/core/styles.css';
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";


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
              <Route path="/" element={<CreatePage />} />
              <Route path="/page/:id" element={<SinglePage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateProfileRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </AppShell.Main>
        </AppShell>
      </Router>
    </MantineProvider>
  );
}

export default App
