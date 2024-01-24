import React from 'react'
import { useState } from 'react'
import axios from 'axios';


const CreatePage = () => {
    const [formData, setFormData] = useState({
        title: '',
        text: '',
        date: '',
        attachments: [],
        link: 'a',
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        const date = new Date();

        data.append('title', formData.title);
        data.append('text', formData.text);
        data.append('date', date);
        data.append('link', formData.link);
        // for (let pair of data.entries()) {
        //   console.log(pair[0] + ', ' + pair[1]);
        // }

        formData.attachments.forEach((file, index) => {
            data.append(`attachments`, file);
        })

        const res = await axios.post('api/page', data,
            { headers: { 'Content-Type': 'multipart/form-data' } });

        // console.log(formData)
        // console.log(res);

        // const res = await fetch('/api/page', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(formData),
        // })

        // const data = await res.json()

        // console.log(res.json())
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

export default CreatePage