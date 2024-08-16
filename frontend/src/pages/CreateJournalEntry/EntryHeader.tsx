import { Title, TextInput, Button, Group, Center, Text } from '@mantine/core';
import styles from './CreateEntry.module.css';
import { format } from 'date-fns'

import { FaPencil, FaRegTrashCan,FaCalendarDay } from "react-icons/fa6";

type Props = {
    error: {
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
    handleDelete: () => void;
    startEdit: () => void;
    open: () => void;
}


const EntryHeader = ({error, formValues, isSaving, isEditing, handleChange, startEdit, handleDelete, open }: Props) => {

    return (
        <>
        { isEditing ? 
<>
            <Group justify='space-between'>
                <Group>
                    <Button color="black" onClick={open}><FaCalendarDay /></Button>
                    {error.message && <Text color='red'>{error.message}</Text>}
                    <Title order={3}>{formValues?.date ? format(formValues?.date, 'MMMM do, yyy') : ''}</Title>
                    {error.date && <Text color='red'>{error.date}</Text>}
                </Group>
                {/* {isSaving ? <Button type='submit' disabled={isSaving} color="black">Saving...</Button> : <Button type='submit' color="black">Save</Button>} */}
                <Button type='submit' disabled={isSaving} color="black">Save</Button>
            </Group>
            <Center>
                <TextInput onChange={handleChange} error={error.title} placeholder='Title of your day!' name='title' radius="xs" size='lg' className={styles.entryTitle} maxLength={40} />
            </Center>
</> : 
<>
<Group justify='space-between'>
                            <Group>
                                <Title order={3}>{formValues?.date ? format(formValues.date, 'MMMM do, yyy') : ''}</Title>
                                <Button color="black" onClick={open} size='sm' variant='outline' style={{ border: 'none' }}><FaCalendarDay /></Button>
                            </Group>
                            <Group>
                                <Button variant="outline" color="black" size="xs" onClick={startEdit}><FaPencil /></Button>
                                <Button onClick={handleDelete} variant="outline" color="black" size="xs"><FaRegTrashCan /></Button>
                            </Group>
                        </Group>
                        <Center>
                            <Title order={1}>{formValues?.title}</Title>
                        </Center>
</>
        }
        </>
    )
}

export default EntryHeader