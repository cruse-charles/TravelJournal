import { ChangeEvent, useState, useEffect } from 'react'
//NEW
import { deleteSelectedFiles, getUpdatedFiles, updatePreviews } from '../../utils/uploaderHelper';
//NEW

type FormValues = {
    title: string;
    text: string;
    date: Date | null;
    attachments: (File | string)[];
    user: string | null;
}

const defaultFormValues: FormValues = {
    title: '',
    text: '',
    date: null,
    attachments: [],
    user: null,
};

type Errors = {
    title?: string;
    text?: string;
    date?: string;
    message?: string;
}

//NEW
type Preview = {
    imageUrl: string;
    fileName: string;
}
//NEW

export const useEntryForm = (initialFormValues: FormValues = defaultFormValues) => {
    const [formValues, setFormValues] = useState<FormValues>(initialFormValues)
    const [formErrors, setFormErrors] = useState<Errors>({})
    //NEW
    // const [previews, setPreviews] = useState<(File | string)[]>([]);
    const [previews, setPreviews] = useState<(Preview)[]>([]);
    const [files, setFiles] = useState<(File | string)[]>(initialFormValues.attachments);
    //NEW


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        })
        setFormErrors({})
    }

    const checkFormErrors = (formValues: FormValues) => {

        let hasFormErrors = false
        const newFormErrors: Errors = {}
        if (!formValues.title) {
            newFormErrors.title = 'Title is required'
            hasFormErrors = true
        }

        if (!formValues.text) {
            newFormErrors.text = 'Text is required'
            hasFormErrors = true
        }

        if (!formValues.date) {
            newFormErrors.date = 'Date is required'
            hasFormErrors = true
        }

        setFormErrors((prev) => ({ ...prev, ...newFormErrors }))
        return hasFormErrors
    }

    //NEW
    // add new images to entry and previews
    // // works on edit entry
    // const handleImageChange = (newFiles: File[]) => {
    //     const updatedFiles = [...formValues.attachments, ...newFiles];
    //     setPreviews((prevState) => [...prevState, ...newFiles])
    //     setFormValues({
    //         ...formValues,
    //         attachments: updatedFiles,
    //     });
    // };

    // // works in create entry
    // const handleImageChange = (newFiles: File[]) => {
    //     const updatedFiles = [...files, ...newFiles];
    //     setPreviews(updatePreviews(updatedFiles));
    //     setFiles(updatedFiles)
    //     setFormValues({
    //         ...formValues,
    //         attachments: updatedFiles,
    //     });
    // };

    const handleImageChange = (newFiles: File[]) => {
        // const updatedFiles = [...formValues.attachments, ...newFiles];
        const updatedFiles = [...files, ...newFiles];
        // console.log('UPDATED FileS', updatedFiles)
        setPreviews(updatePreviews(updatedFiles));
        // setPreviews((prevState) => [...prevState, ...updatedFiles])
        setFiles(updatedFiles)
        setFormValues({
            ...formValues,
            attachments: updatedFiles,
        });
    }

    // delete preview image from preview and entry
    const deleteSelectedImage = (key: string) => {
        const updatedFiles = deleteSelectedFiles(previews, key)

        setPreviews(updatedFiles);
        setFormValues({
            ...formValues,
            attachments: updatedFiles,
        });
    };

    //NEW

    // return { formValues, setFormValues, formErrors, handleChange, checkFormErrors }
    return { formValues, setFormValues, formErrors, handleChange, checkFormErrors, handleImageChange, deleteSelectedImage, previews, setPreviews, files, setFiles }

}