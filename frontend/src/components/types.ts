export type RootState = {
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

export type Entry = {
    title: string;
    text: string;
    date: Date | null;
    attachments: (File | string)[];
    user: string | null;
}