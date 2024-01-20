import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'


const SinglePage = () => {
    const [page, setPage] = useState({})
    const { id } = useParams();

    useEffect(() => {
        axios.get(`api/page/${id}`)
            .then(res => {
                setPage(res.data)
            })
    }, [id])

    return (
        <>
            <div>{page.title}</div>
            <div>{page.text}</div>
            {attachments.map((imageURL, index) => {
                return <img key={index} src={imageURL} />
            })}
        </>
    )
}

export default SinglePage