declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                name: string;
                email: string;
                publicAddress: string | null;
            }
        }
    }
}

export {};