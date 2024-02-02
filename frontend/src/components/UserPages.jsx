import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Card, Text } from '@mantine/core';

const UserPages = () => {
    const { currentUser } = useSelector(state => state.user)
    const [pages, setPages] = useState([])

    useEffect(() => {

        const controller = new AbortController();

        axios.get(`api/user/pages/${currentUser._id}`, { signal: controller.signal })
            .then(res => {
                setPages(res.data)
            }).catch((error) => {
                console.log(error.response.data.message)
            })

        return () => controller.abort();
    }, [])


    return (
        <>
            <div>UserPages</div>
            {pages.map(page => (
                <Card shadow="sm" padding="lg" radius="md" withBorder >
                    <Text fw={500}>{page.title}</Text>
                    <Text truncate='end'>{page.text}</Text>
                </Card>
                // <div key={page._id}>
                // {/* <div>{page.title}</div> */ }
                // {/* <div>{page.text}</div> */ }
                // {/* <div>{page._id}</div> */ }
                // {/* <div>{page.date}</div> */ }
                // {/* {page.attachments?.map((imageURL, index) => {
                //     return <img key={index} src={imageURL} />
                // })} */}
                // </div>
            ))}
        </>
    )
}

export default UserPages