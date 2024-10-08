import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Title, Flex, Text, Stack, Group, Button, Space, Container } from '@mantine/core';
import styles from './About.module.css'

type RootState = {
    user: {
        currentUser: {
            _id: string,
            username: string,
            email: string
        },
        loading: boolean,
        error: string
    }
}

const About = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: RootState) => state.user);

    const handleSignupButtonClick = () => {
        navigate(`/signup`)
    }

    const handleCreateJournalButtonClick = () => {
        if (!currentUser) {
            navigate(`/signup`)
            return
        } else {
            navigate(`/create`)
        }
    }

    return (
        <Stack justify="center" gap='xl' className={styles.aboutContainer} >
            <Group className={styles.firstSectionContainer}>
                <Stack gap='xs' className={styles.firstSectionText}>
                    <Title order={1}>Capture Your Travel Adventure</Title>
                    <Text size='xl'>Travel Journal is a platform that helps you document your journeys and share your experiences with the world.</Text>
                    <Space h='md' />
                    <Button color='black' onClick={handleCreateJournalButtonClick} style={{ width: '35%' }}>Start Journaling</Button>
                </Stack>
                <Container>
                    <Text>I'm going to put a Video here, I know there isn't a video here so dont tell me there isnt a video here</Text>
                </Container>
            </Group>
            <Space h='xl' />
            <Space h='xl' />
            <Space h='xl' />
            <Space h='xl' />
            <Flex justify='center' align='center'>
                <Stack align='center' gap='xs' className={styles.secondSectionContainer}>
                    <Title order={1}>About TravelJournal</Title>
                    <Text ta='center' size='xl'>Travel Journal is a platform designed to help you capture and share your travel experiences. Whether you're an avid explorer or a casual traveler, our app provides a beautiful and personal way to document your journeys, preserve your memories, and inspire others.</Text>
                    <Space h='xl' />
                    <Group align='flex-start'>
                        <Stack justify='flex-start' align='center' className={styles.secondSectionText}>
                            <Title ta='center'>About the Developer</Title>
                            <Text ta='center'>Travel Journal was created by Charles Cruse, a passionate adventurer and software engineer. With a deep love for exploring new places and capturing their essence, Charles built this platform to help others document their own travel experiences.</Text>
                        </Stack>
                        <Stack justify='flex-start' align='center' className={styles.secondSectionText}>
                            <Title ta='center'>Built with Leading Technologies</Title>
                            <Text ta='center'>Travel Journal is powered by React and Express, popular for building fast and scalable web applications. We use MongoDB for our database and AWS for secure image uploads, ensuring a seamless and reliable experience for our users.</Text>
                        </Stack>
                        <Stack justify='flex-start' align='center' className={styles.secondSectionText}>
                            <Title ta='center'>Start Journaling Your Adventures</Title>
                            <Text ta='center'>Sign up today and begin capturing your travel memories through journal entries, photos, and more. Travel Journal is the perfect companion for your adventures, helping you preserve and share your unique experiences with the world.</Text>
                            <Button color='black' onClick={handleSignupButtonClick}>Sign Up</Button>
                        </Stack>
                    </Group>
                </Stack>
            </Flex>
            <Space h='xl' />
            <Space h='xl' />
            <Space h='xl' />
            <Space h='xl' />
        </Stack>
    )
}

export default About