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

export type ErrorResponse = {
    response: {
        data: {
            message: string;
        }
    }
}

export type RootState = {
    user: {
        currentUser: {
            _id: string
        }
    }
}

export type ApiErrors = string | null;