import { ChangeEvent, useState } from 'react'
import { deleteSelectedFiles, updatePreviews } from '../../utils/uploaderHelper';
import { FormValues, Errors, Preview } from './types';

const defaultFormValues: FormValues = {
    title: '',
    text: '',
    date: null,
    attachments: [],
    user: null,
};


export const useEntryForm = (initialFormValues: FormValues = defaultFormValues, create: boolean = false) => {
    // initialize formValues with entry values, set errors and previews empty
    const [formValues, setFormValues] = useState<FormValues>(initialFormValues)
    const [formErrors, setFormErrors] = useState<Errors>({})
    const [previews, setPreviews] = useState<(Preview)[]>([]);

    // initialize files with entry attachments (URLs)
    const [files, setFiles] = useState<(File | string)[]>(initialFormValues.attachments);


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        })
        setFormErrors({})
    }

    // Check form errors for title, text, date
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

    // Add new file images to entry previews
    const handleAddImage = (newFiles: File[]) => {
        // updatedFiles is array of files or objectURLs
        const updatedFiles = [...files, ...newFiles];

        // Configure updatedFiles to array of objects, {imageUrl, fileName}
        setPreviews(updatePreviews(updatedFiles));

        // set files and FormValues.attachments to array of files or objectURLs
        setFiles(updatedFiles)
        setFormValues({
            ...formValues,
            attachments: updatedFiles,
        });
    }

    // delete preview image from preview and entry
    const deleteSelectedImage = (key: string) => {
        // updatedFiles is array objects, {imageUrl, fileName}
        const updatedFiles = deleteSelectedFiles(previews, key)

        setPreviews(updatedFiles);

        const fileUrls = updatedFiles.map((file: Preview) => file.imageUrl)
        setFiles(fileUrls)

        setFormValues({
            ...formValues,
            attachments: updatedFiles,
        });
    };

    return { formValues, setFormValues, formErrors, setFormErrors, handleChange, checkFormErrors, handleAddImage, deleteSelectedImage, previews, setPreviews, files, setFiles }

}