import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Textarea, Flex, Stack, Modal, Image, Indicator } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { DatePicker } from '@mantine/dates';
import { Carousel } from '@mantine/carousel';

import { useDisclosure } from '@mantine/hooks';
import styles from './Entry.module.css';

import useUserEntryDateHash from '../../hooks/useUserEntryDateHash';
import { getFormattedDate, getSelectedDayProps } from '../../utils/dateUtils';
import { updateFormData } from '../../utils/updateFormData';
import placeholderImage from '../../assets/DropzonePlaceholder.svg'
import { useEntryForm } from './useEntryForm';
import EntryHeader from './EntryHeader';
import { getUpdatedFiles } from '../../utils/uploaderHelper';

type RootState = {
    user: {
        currentUser: {
            _id: string
        }
    }
}

type Errors = {
    title?: string;
    text?: string;
    date?: string;
    message?: string;
}

type ErrorResponse = {
    response: {
        data: {
            message: string;
        }
    }
}

type Preview = {
    imageUrl: string;
    fileName: string;
}

const CreateEntry = () => {
    // Retrieve entryIdHash containing {date:id} of user's entries
    const { entryIdHash } = useUserEntryDateHash();

    // Retrieve current user from redux store
    const { currentUser } = useSelector((state: RootState) => state.user);

    // State vars for files, error, formValues
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<Errors>({});
    const [isSaving, setIsSaving] = useState(false);


    const initialFormValues = {
        title: '',
        text: '',
        date: null,
        attachments: [],
        user: currentUser ? currentUser._id : null,
    }

    const {formValues, formErrors, setFormValues, handleChange, checkFormErrors, handleAddImage, deleteSelectedImage, previews} = useEntryForm(initialFormValues, true)


    useEffect(() => {
        // Cleanup function to revoke blob URLs when component unmounts
        return () => {
            previews.forEach((preview) => {
                URL.revokeObjectURL(preview.imageUrl);
            });
        };
    }, []);

    // useDisclosure hook to open and close modal, useNavigate hook to navigate to new entry
    const [opened, { open, close }] = useDisclosure(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const hasFormErrors = checkFormErrors(formValues)
        if (hasFormErrors) return
        setIsSaving(true);

        // Post request with FormData object and content type for files, navigate to entry upon creation
        try {
            // old
            // const { attachments, ...restOfFormValues } = formValues;
            // console.log('ATTACHMENTS', attachments)
            
            // const data = updateFormData(restOfFormValues, attachments);
            // const res = await axios.post('api/entry', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            // navigate(`/entry/${res.data}`)
            // old


            // new
            const { attachments, ...restOfFormValues } = formValues;
            console.log('ATTACHMENTS', attachments)
            const convertAttachmentsToFiles = await getUpdatedFiles(attachments);
            console.log('CONVERTED ATTACHMENTS', convertAttachmentsToFiles)
            
            const data = await updateFormData(restOfFormValues, convertAttachmentsToFiles);
            console.log('DATA FOR ENTRY', data.forEach((value, key) => console.log(key, value)))
            const res = await axios.post('api/entry', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            navigate(`/entry/${res.data}`)
            
            // new
        } catch (err) {
            setIsSaving(false);
            const error = err as ErrorResponse
            setError((prevErrors) => ({ ...prevErrors, message: error.response.data.message }))
        }
    }

    // const deleteSelectedImage = (fileName: string) => {
    //     // Remove file from files array and update formValues and previews
    //     const updatedFiles = files.filter((file) => file.name !== fileName);
    //     setFiles(updatedFiles);
    //     setPreviews(updatePreviews(updatedFiles));

    //     setFormValues({
    //         ...formValues,
    //         attachments: updatedFiles
    //     })
    // }

    // <Image key={item.imageUrl} src={item.imageUrl} onLoad={() => URL.revokeObjectURL(item.imageUrl)} className={styles.image} />


    return (
        <>
            <form onSubmit={handleSubmit}>
                <Stack className={styles.entryContainer} >
                    <EntryHeader isEditing={true} error={formErrors} formValues={formValues} isSaving={isSaving} handleChange={handleChange} open={open} />
                    <Flex className={styles.carouselTextAreaContainer} gap='xl'>
                        <Carousel style={{ width: '50%' }} height='100%' loop withIndicators slideSize={{ base: '100%' }}>
                            {previews.map((item) => {
                                return (
                                    <Carousel.Slide key={item.imageUrl} >
                                        <Indicator size={15} color="red" offset={12} className={styles.indicator} onClick={() => deleteSelectedImage(item.imageUrl)} label="X" />
                                        <Image key={item.imageUrl} src={item.imageUrl} className={styles.image} />
                                        </Carousel.Slide>
                                )
                            })}
                            <Carousel.Slide>
                                <Dropzone accept={IMAGE_MIME_TYPE} onDrop={handleAddImage} className={styles.dropzone}>
                                    <Image src={placeholderImage} />
                                </Dropzone>
                            </Carousel.Slide>
                        </Carousel>
                        <Textarea className={styles.textArea} name='text' onChange={handleChange} error={formErrors.text} placeholder='Write what happened this day!' autosize minRows={15} maxRows={15} size='lg' radius="xs" />
                    </Flex>
                </Stack>
                <Modal opened={opened} onClose={close} title="Select a Date" size='auto'>
                    <DatePicker
                        onChange={(date) => setFormValues({ ...formValues, date: date })}
                        getDayProps={(date) => getSelectedDayProps(formValues, date)}
                        excludeDate={(date) => entryIdHash[getFormattedDate(date)]}
                    />
                </Modal>
            </form>
        </>
    )
}

export default CreateEntry