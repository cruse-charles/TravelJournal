import { ChangeEvent, useState } from 'react'
import { deleteSelectedFiles, getUpdatedFiles, updatePreviews } from '../../utils/uploaderHelper';

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

type Preview = {
    imageUrl: string;
    fileName: string;
}

export const useEntryForm = (initialFormValues: FormValues = defaultFormValues) => {
    const [formValues, setFormValues] = useState<FormValues>(initialFormValues)
    const [formErrors, setFormErrors] = useState<Errors>({})
    const [previews, setPreviews] = useState<(Preview)[]>([]);
    const [files, setFiles] = useState<(File | string)[]>(initialFormValues.attachments);


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

    // Add new file images to entry previews
    const handleAddImage = (newFiles: File[]) => {
        const updatedFiles = [...files, ...newFiles];
        setPreviews(updatePreviews(updatedFiles));
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

    return { formValues, setFormValues, formErrors, handleChange, checkFormErrors, handleAddImage, deleteSelectedImage, previews, setPreviews, files, setFiles }

}