import React from 'react'
import { Title, Flex, Text, Stack, Group, Paper, Button, Space, Container } from '@mantine/core';
const About = () => {
    return (
        <Stack justify="center" gap='xl' style={{ paddingTop: '100px' }}>
            <Group style={{ width: '100%', paddingLeft: '10%' }}>
                <Stack gap='xs' style={{ width: '40%' }}>
                    <Title order={1}>Capture Your Travel Adventure</Title>
                    <Text size='xl'>Travel Journal is a platform that helps you document your journeys and share your experiences with the world.</Text>
                    <Space h='md' />
                    <Button color='black' style={{ width: '30%' }}>Start Journaling</Button>
                </Stack>
                <Container>
                    <Text>Video Here</Text>
                </Container>
            </Group>
            <Space h='xl' />
            <Space h='xl' />
            <Space h='xl' />
            <Space h='xl' />
            <Flex justify='center' align='center'>
                <Stack align='center' gap='xs' style={{ width: '66%' }}>
                    <Title order={1}>About TravelJournal</Title>
                    <Text align='center' size='xl'>Travel Journal is a platform designed to help you capture and share your travel experiences. Whether you're an avid explorer or a casual traveler, our app provides a beautiful and personal way to document your journeys, preserve your memories, and inspire others.</Text>
                    <Group>
                        <Stack align='center' style={{ width: '30%' }}>
                            <Title align='center'>About the Developer</Title>
                            <Text align='center'>Travel Journal was created by Charles, a passionate adventurer and software engineer. With a deep love for exploring new places and capturing their essence, Charles built this platform to help others document their own travel experiences.</Text>
                        </Stack>
                        <Stack align='center' style={{ width: '30%' }}>
                            <Title align='center'>Built with...</Title>
                            <Text align='center'>Travel Journal is powered by React and Express, popular for building fast and scalable web applications. We use MongoDB for our database and AWS for secure image uploads, ensuring a seamless and reliable experience for our users.</Text>
                        </Stack>
                        <Stack align='center' style={{ width: '30%' }}>
                            <Title align='center'>Start Journaling Your Adventures</Title>
                            <Text align='center'>Sign up today and begin capturing your travel memories through journal entries, photos, and more. Travel Journal is the perfect companion for your adventures, helping you preserve and share your unique experiences with the world.</Text>
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