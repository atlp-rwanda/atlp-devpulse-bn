export class CustomGraphQLError extends Error {
    constructor(message:any) {
        super(message);
        this.name = 'CustomGraphQLError';
    }
}

export const formatError = (error:any) => {
    if (error.originalError instanceof CustomGraphQLError) {
        return { message: 'something went wrong',error:error.message };
    }
    return error;
};