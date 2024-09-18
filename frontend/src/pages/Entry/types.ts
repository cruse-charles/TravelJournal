export type FormValues = {
    title: string;
    text: string;
    date: Date | null;
    attachments: (File | string)[];
    user: string | null;
}

export type Errors = {
    title?: string;
    text?: string;
    date?: string;
    message?: string;
}

export type Preview = {
    imageUrl: string;
    fileName: string;
}