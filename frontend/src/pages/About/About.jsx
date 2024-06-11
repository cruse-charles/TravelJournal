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
                    <Text size='xl'>Travel Journal is a platform designed to help you capture and share your travel experiences. Whether you're an avid explorer or a casual traveler, our app provides a beautiful and personal way to document your journeys, preserve your memories, and inspire others.</Text>
                    <Group>
                        <Stack align='center' style={{ width: '30%' }}>
                            <Title >Sub point1</Title>
                            <Text>blah blah blah blahblah blah blah blahblah blah blah blahblah blah blah blahblah blah blah blahblah blah blah blahblah blah blah blah</Text>
                        </Stack>
                        <Stack align='center' style={{ width: '30%' }}>
                            <Title>Sub point1</Title>
                            <Text>blah blah blah blahblah blah blah blahblah blah blah blahblah blah blah blahblah blah blah blahblah blah blah blahblah blah blah blahblah blah blah blah</Text>
                        </Stack>
                        <Stack align='center' style={{ width: '30%' }}>
                            <Title>Sub point1</Title>
                            <Text>blah blah blah blahblah blah blah blahblah blah blah blahblah blah blah blahblah blah blah blahblah blah blah blahblah blah blah blahblah blah blah blah</Text>
                        </Stack>
                    </Group>
                </Stack>
            </Flex>
        </Stack>
    )
}

export default About