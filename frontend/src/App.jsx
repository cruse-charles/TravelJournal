import { useState } from 'react'
import './App.css'
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreatePage from './components/CreatePage';
import SinglePage from './components/SinglePage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreatePage />} />
        <Route path="/page/:id" element={<SinglePage />} />
      </Routes>
    </Router>
  )
}

export default App
