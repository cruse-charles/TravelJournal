import { Title, TextInput, Button, Group, Center, Text } from '@mantine/core';
import styles from './Entry.module.css';

import { format } from 'date-fns'

// https://react-icons.github.io/react-icons/icons/fa6/
import { FaPencil, FaRegTrashCan,FaCalendarDay } from "react-icons/fa6";

type Props = {
    formErrors: {
        message?: string;
        date?: string;
        title?: string;
    };
    formValues: {
        date: Date | null;
        title: string;
    };
    isSaving: boolean;
    isEditing: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDelete?: () => void;
    startEdit?: () => void;
    open: () => void;
}


const EntryHeader = ({formErrors, formValues, isSaving, isEditing, handleChange, startEdit, handleDelete, open }: Props) => {

    const renderButtons = () => {
        if (isEditing) {
            return <Button type='submit' disabled={isSaving} color="black">Save</Button>
        } else {
            return (
                <Group>
                    <Button variant="outline" color="black" size="xs" onClick={startEdit}><FaPencil /></Button>
                    <Button onClick={handleDelete} variant="outline" color="black" size="xs"><FaRegTrashCan /></Button>
                </Group>
            )
        }
    }

    const renderTitleOrInput = () => {
        if (isEditing) {
            return <TextInput value={formValues.title} onChange={handleChange} error={formErrors.title} placeholder='Title of your day!' name='title' radius="xs" size='lg' className={styles.entryTitle} maxLength={40} />
        } else {
            return <Title order={1}>{formValues?.title}</Title>
        }
    }

    return (
            <>
                <Group justify='space-between'>
                    <Group>
                        <Button color="black" onClick={open}><FaCalendarDay /></Button>
                        {formErrors.title && <Text color='red'>{formErrors.title}</Text>}
                        <Title order={3}>{formValues?.date ? format(formValues?.date, 'MMMM do, yyy') : ''}</Title>
                        {formErrors.date && <Text color='red'>{formErrors.date}</Text>}
                    </Group>
                    {renderButtons()}
                </Group>
                <Center>
                    {renderTitleOrInput()}
                </Center>
            </> 
    )
}

export default EntryHeader