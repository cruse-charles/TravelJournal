import { useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    date: '',
    attachments: [],
    link: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      date: new Date().toISOString(),
    })

    const res = await fetch('/api/page', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json()

    console.log(data)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      attachments: Array.from(e.target.files),
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type='file' name='' accept='image/*' onChange={handleImageChange} />
        <input type='text' name='title' onChange={handleChange} placeholder='Title of your day!'></input>
        <input type='text' name='text' onChange={handleChange} placeholder='Write what happened today!'></input>
        <button>Save</button>
      </form>
    </>
  )
}

export default App
