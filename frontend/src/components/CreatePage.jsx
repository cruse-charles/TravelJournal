import React, { useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import CalendarCreatePage from './CalendarCreatePage';

const CreatePage = () => {
    const { currentUser } = useSelector(state => state.user);

    const [error, setError] = useState(null);

    const [formValues, setFormValues] = useState({
        title: '',
        text: '',
        date: '',
        attachments: [],
        user: currentUser ? currentUser._id : null,
    });

    const createFormData = () => {
        //create FormData object to submit object with files
        const data = new FormData();
        // const date = new Date();

        // append data and files to FormData object
        data.append('title', formValues.title);
        data.append('text', formValues.text);
        data.append('date', formValues.date);
        data.append('user', formValues.user)

        formValues.attachments.forEach((file, index) => {
            data.append(`attachments`, file);
        });

        console.log(formValues)
        return data;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Post request with FormData object and content type for files
        try {
            const data = createFormData();

            const res = await axios.post('api/page', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        } catch (error) {
            setError(error.response.data.message)
            // alert(error.message)
        }
    }

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    // Create an array of files from the input field and set it to formData
    const handleImageChange = (e) => {
        setFormValues({
            ...formValues,
            attachments: Array.from(e.target.files),
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type='file' name='' accept='image/*' onChange={handleImageChange} />
                <input type='text' value={formValues.title} name='title' onChange={handleChange} placeholder='Title of your day!'></input>
                <input type='text' value={formValues.text} name='text' onChange={handleChange} placeholder='Write what happened today!'></input>
                <input type='date' onChange={(e) => setFormValues({ ...formValues, date: e.target.value })} />
                <button>Save</button>
                {error && <div>{error}</div>}
            </form>
        </>
    )
}

export default CreatePage