import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Stack, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';

import useUserEntryDateHash from '../../hooks/useUserEntryDateHash';
import { getEntryDayProps, excludeDateFunction } from '../../utils/dateUtils';
import { deleteSelectedFiles, getUpdatedFiles } from '../../utils/uploaderHelper';
import { getUserEntry, getUpdatedEntry, deleteEntry } from '../../utils/apiService';
import { updateFormData } from '../../utils/updateFormData';
import { useEntryForm } from './useEntryForm';
import EntryHeader from './EntryHeader';
import EntryImagesAndText from './EntryImagesAndText'

import CalendarViewEntries from '../../components/CalendarViewEntries';

//TRPC - typescript remote procedure call, way to call backend functions, something more advanced 
// Deno TS Config - check this, 


//.d.ts = type declaration file, it's a file that tells typescript what the types are for a certain library, try not to use too much.

type Errors = {
    title?: string;
    text?: string;
    message?: string;
}
// have it higher up in a folder in a .ts


type ErrorResponse = {
    response: {
        data: {
            message: string;
        }
    }
}

const SingleEntry = () => {
    // state vars for entry, loading, and previews
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false)
    // Can try to bundle these together into a single state/union type if these are always changing together of editing state: 'loading, editing, saving'
        // Can even put objects out of these where loading is the type and has percent with it, then in editing maybe editing obj with a message
        // {kind: 'loading', percent: 0} | {kind: 'editing', message: 'saving'} | {kind: 'saving', message: 'saving'}

        // can look into using never type sometimes too, to make sure something is never used, like a default case in a switch statement
    const [previews, setPreviews] = useState<(File | string)[]>([]);
    const [originalEntryDate, setOriginalEntryDate] = useState<Date | null>(null);
    const [errors, setErrors] = useState<Errors>({})
    const [isSaving, setIsSaving] = useState(false)

    const {formValues, formErrors, setFormValues, handleChange, checkFormErrors} = useEntryForm()

    // custom hook to get entryIdHash
    const { entryIdHash } = useUserEntryDateHash();

    // useDisclosure hook to open and close modal
    const [opened, { open, close }] = useDisclosure(false);

    // extract entry id from url, and navigate function
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();

    useEffect(() => {
        // fetch entry data and set entry and previews state vars
        const controller = new AbortController();

        // retrieve entry or navigate to profile page if undefined
        // TODO: navigate to 404 page if entry is not found
        if (id) {
            getUserEntry(id, controller.signal)
                .then(entryResponse => {
                    setFormValues(entryResponse)
                    setOriginalEntryDate(entryResponse.date);
                    setIsLoading(false);
                    setPreviews(entryResponse.attachments)
                }).catch(error => {
                    setErrors({ message: error.response.data.message })
                    setIsLoading(false)
                })
        } else {
            navigate('/profile')
        }

        return () => controller.abort();
    }, [id, isEditing])

    // show loading message while request is in progress
    if (isLoading) {
        return <div>Loading...</div>
    }

    // delete entry and navigate to profile page
    const handleDelete = async () => {
        try {
            await deleteEntry(id)
            navigate('/profile')
        } catch (err) {
            const error = err as ErrorResponse;
            setErrors({ message: error.response.data.message })
        }
    }

    const startEdit = () => {
        setIsEditing(true)
    }

    // add new images to entry and previews
    const handleImageChange = (newFiles: File[]) => {
        const updatedFiles = [...formValues.attachments, ...newFiles];
        setPreviews((prevState) => [...prevState, ...newFiles])
        setFormValues({
            ...formValues,
            attachments: updatedFiles,
        });
    };

    // delete preview image from preview and entry
    const deleteSelectedImage = (key: string) => {
        const updatedFiles = deleteSelectedFiles(previews, key)

        setPreviews(updatedFiles);
        setFormValues({
            ...formValues,
            attachments: updatedFiles,
        });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // const hasFormErrors = checkFormErrors(entry)
        const hasFormErrors = checkFormErrors(formValues)
        if (hasFormErrors) return

        // evaluate if the file is a URL or a file object, then add to formData
        const updatedFiles = await getUpdatedFiles(previews)
        const formData = updateFormData(formValues, updatedFiles)
        updateEntry(formData);
    };

    // update entry with new data and set isEditing to false
    const updateEntry = async (formData: FormData) => {
        try {
            setIsSaving(true)
            const response = await getUpdatedEntry(id, formData)
            setFormValues(response.data)
            setIsEditing(false)
            setIsSaving(false)
        } catch (err) {
            const error = err as ErrorResponse;
            setErrors({ message: error.response.data.message })
        }
    }

    return (
        <>
            {!isEditing ? (
                <>
                    <Stack style={{ height: '70vh' }} p='lg' gap='xs'>
                        <EntryHeader handleDelete={handleDelete} startEdit={startEdit} isEditing={false} error={errors} formValues={formValues} isSaving={isSaving} handleChange={handleChange} open={open}/>
                        <EntryImagesAndText formValues={formValues} isEditing={isEditing}/>
                    </Stack>
                    <Modal opened={opened} onClose={close} title="Select a Date" size='auto'>
                        <CalendarViewEntries scale={1} entry={formValues} />
                    </Modal>
                </>
            ) : (
                <>
                    <form onSubmit={handleSubmit}>
                        <Stack style={{ height: '70vh' }}>
                            <EntryHeader handleDelete={handleDelete} startEdit={startEdit} isEditing={true} error={formErrors} formValues={formValues} isSaving={isSaving} handleChange={handleChange} open={open}/>
                            <EntryImagesAndText formValues={formValues} isEditing={isEditing} formErrors={formErrors} previews={previews} deleteSelectedImage={deleteSelectedImage} handleImageChange={handleImageChange} handleChange={handleChange}/>
                        </Stack>
                        <Modal opened={opened} onClose={close} title="Select a Date" size='auto'>
                            <DatePicker
                                onChange={(date) => setFormValues({ ...formValues, date: date })}
                                getDayProps={(date) => getEntryDayProps(formValues, date)}
                                excludeDate={(date) => excludeDateFunction(date, originalEntryDate, entryIdHash)}
                            />
                        </Modal>
                    </form>
                </>
            )}
        </>
    )
}

export default SingleEntry