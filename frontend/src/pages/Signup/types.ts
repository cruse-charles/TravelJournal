export type UserFormValues = {
    username: string;
    email: string;
    password: string;
}

export type ErrorResponse = {
    response: {
        data: {
            message: string;
        }
    }
}

export type ApiErrors = string | null;