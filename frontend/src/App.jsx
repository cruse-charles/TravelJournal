import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import CreatePage from './components/CreatePage';
import SinglePage from './components/SinglePage';
import SignUp from './components/SignUp';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreatePage />} />
        <Route path="/page/:id" element={<SinglePage />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  )
}

export default App
