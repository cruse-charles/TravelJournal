import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

type FormValues = {
    title: string;
    text: string;
    date: Date | null;
    attachments: (File | string)[];
    user: string | null;
}

type Errors = {
    title?: string;
    text?: string;
    date?: string;
    message?: string;
}

export const useEntryForm = (initialFormValues: FormValues) => {
    const [formValues, setFormValues] = useState<FormValues>(initialFormValues)
    const [formErrors, setFormErrors] = useState<Errors>({})

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        })
        setFormErrors({})
    }

    return { formValues, setFormValues, formErrors, handleChange }
}