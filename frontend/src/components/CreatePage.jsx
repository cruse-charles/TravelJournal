import React, { useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import CalendarViewPages from './CalendarViewPages';

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

    // Look into using axios library to make a POST request to the backend instead of doing this basic 'createform'
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
            <div className=''>
                <form onSubmit={handleSubmit} className=''>
                    <div className=''>
                        <input type='date' onChange={(e) => setFormValues({ ...formValues, date: e.target.value })} />
                    </div>
                    <div className=''>
                        <div className=''>
                            <input type='file' name='' accept='image/*' onChange={handleImageChange} multiple />

                        </div>
                        <div className=''>
                            <input type='text' value={formValues.title} name='title' onChange={handleChange} placeholder='Title of your day!'></input>

                        </div>
                        <div className=''>
                            <input type='text' value={formValues.text} name='text' onChange={handleChange} placeholder='Write what happened today!'></input>

                        </div>
                        <div className=''>
                            <button>Save</button>

                        </div>

                    </div>
                    {error && <div>{error}</div>}
                </form>

                {/* < CalendarViewPages /> */}
            </div>
        </>
    )
}

export default CreatePage