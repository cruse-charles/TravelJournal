import React, { useState, useEffect, useRef } from 'react';

import { Image, Flex, Text, Stack, ScrollArea, Modal, Textarea, Indicator } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';

type Props = {
    formValues: {
        text: string;
        attachments: (File | string)[];
    }
} 

const EntryImagesAndText = ({formValues}: Props) => {
    const autoplay = useRef(Autoplay({ delay: 3000 }))


    return (
        <Flex style={{ height: '100%' }} gap='xl'>
            <Carousel style={{ width: '50%' }} plugins={[autoplay.current]} onMouseEnter={autoplay.current.stop} onMouseLeave={autoplay.current.reset} height='100%' loop withIndicators slideSize={{ base: '100%' }}>
                {formValues?.attachments?.map((imageURL) => {
                    const src = imageURL as string;
                    return (
                        <Carousel.Slide key={src} >
                            <Image key={src} src={src} />
                        </Carousel.Slide>
                    )
                })}
            </Carousel>
            <ScrollArea style={{ width: '50%', height: '100%' }}>
                <Text style={{ whiteSpace: 'pre-wrap' }}>{formValues?.text}</Text>
            </ScrollArea>
        </Flex>
    )
}

export default EntryImagesAndText