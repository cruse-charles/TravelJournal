import React, { useState, useEffect, useRef } from 'react';

import { Image, Flex, Text, Stack, ScrollArea, Modal, Textarea, Indicator } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';

import placeholderImage from '../../assets/DropzonePlaceholder.svg'


type Props = {
    formValues: {
        text: string;
        attachments: (File | string)[];
    }
    isEditing: boolean;
    previews?: (File | string)[];
    formErrors?: {
        text?: string;
    };
    deleteSelectedImage?: (key: string) => void;
    handleImageChange?: (files: File[]) => void;
    handleChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
} 

const EntryImagesAndText = ({formValues, isEditing, previews, formErrors, deleteSelectedImage = () => {}, handleImageChange = () => {}, handleChange}: Props) => {
    const autoplay = useRef(Autoplay({ delay: 3000 }))


    return (
        <>
            {!isEditing ? (
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
            ) : (
                <Flex style={{ height: '100%' }} gap='xl'>
                    <Carousel style={{ width: '50%' }} height='100%' loop withIndicators slideSize={{ base: '100%' }}>
                        {(previews ?? []).map((item) => {
                            const isFile = item instanceof File;
                            const src = isFile ? URL.createObjectURL(item) : item;
                            const key = isFile ? `file-${item.name}` : `url-${item}`;
                            return (
                                <Carousel.Slide key={key} >
                                    <Indicator size={15} color="black" label='X' offset={12} style={{ cursor: 'pointer' }} onClick={() => deleteSelectedImage(key)}>
                                    </Indicator>
                                    <Image key={key} src={src} onLoad={() => URL.revokeObjectURL(src)} style={{ fit: 'contain' }} />
                                </Carousel.Slide>
                            )
                        })}
                        <Carousel.Slide>
                            <Dropzone accept={IMAGE_MIME_TYPE} onDrop={handleImageChange} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px' }}>
                                <Image src={placeholderImage} />
                            </Dropzone>
                        </Carousel.Slide>
                    </Carousel>
                    <Textarea style={{ width: '50%', height: '100%' }} error={formErrors?.text} name='text' onChange={handleChange} placeholder='Write what happened this day!' autosize minRows={17} maxRows={17} size='lg' radius="xs" value={formValues.text} />
                </Flex>
            )}
        </>
    )
}

export default EntryImagesAndText