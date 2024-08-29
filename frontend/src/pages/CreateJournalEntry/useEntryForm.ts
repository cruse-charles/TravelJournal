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

    return { formValues, setFormValues, formErrors, handleChange, checkFormErrors }
}