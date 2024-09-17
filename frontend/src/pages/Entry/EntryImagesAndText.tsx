import { useRef } from 'react';

import { Image, Flex, Text, ScrollArea, Textarea, Indicator } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';

import placeholderImage from '../../assets/DropzonePlaceholder.svg'
import styles from './Entry.module.css';


type Props = {
    formValues: {
        title: string;
        text: string;
        date: Date | null;
        attachments: (File | string)[];
        user: string | null;
    }
    isEditing: boolean;
    previews?: {
        imageUrl: string;
        fileName: string;
    }[];
    formErrors?: {
        text?: string;
    };
    deleteSelectedImage?: (key: string) => void;
    handleAddImage?: (files: File[]) => void;
    handleChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
} 

const EntryImagesAndText = ({formValues, isEditing, previews, formErrors, deleteSelectedImage = () => {}, handleAddImage = () => {}, handleChange}: Props) => {

    // ref for autoplay plugin
    const autoplay = useRef(Autoplay({ delay: 3000 }))

    return (
        <>
            {!isEditing ? (
                <Flex className={styles.carouselTextAreaContainer} gap='xl'>
                    <Carousel className={styles.carouselContainer} plugins={[autoplay.current]} onMouseEnter={autoplay.current.stop} onMouseLeave={autoplay.current.reset} height='100%' loop withIndicators slideSize={{ base: '100%' }}>
                        {formValues?.attachments?.map((imageURL) => {
                            const src = imageURL as string;
                            return (
                                <Carousel.Slide key={src} >
                                    <Image key={src} src={src} />
                                </Carousel.Slide>
                            )
                        })}
                    </Carousel>
                    <ScrollArea className={styles.scrollArea} >
                        <Text className={styles.entryText}>{formValues?.text}</Text>
                    </ScrollArea>
                </Flex>
            ) : (
                <Flex className={styles.carouselTextAreaContainer} gap='xl'>
                    <Carousel className={styles.carouselContainer} height='100%' loop withIndicators slideSize={{ base: '100%' }}>
                        {(previews ?? []).map((item) => {
                            const key = item.fileName;
                            const src = item.imageUrl;
                            return (
                                <Carousel.Slide key={key} >
                                    <Indicator size={15} color="black" label='X' offset={12} className={styles.indicator} onClick={() => deleteSelectedImage(key)}>
                                    </Indicator>
                                    <Image key={key} src={src} onLoad={() => URL.revokeObjectURL(src)} className={styles.image} />
                                </Carousel.Slide>
                            )
                        })}
                        <Carousel.Slide>
                            <Dropzone accept={IMAGE_MIME_TYPE} onDrop={handleAddImage} className={styles.dropzone}>
                                <Image src={placeholderImage} />
                            </Dropzone>
                        </Carousel.Slide>
                    </Carousel>
                    <Textarea className={styles.textArea} error={formErrors?.text} name='text' onChange={handleChange} placeholder='Write what happened this day!' autosize minRows={17} maxRows={17} size='lg' radius="xs" value={formValues.text} />
                </Flex>
            )}
        </>
    )
}

export default EntryImagesAndText