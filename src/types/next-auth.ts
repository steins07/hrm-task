import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        _id?: string;
        username?: string;
        role?: string
    }
    interface Session {
        user: {
            _id?: string;
            username?: string;
            role?: string
        } & DefaultSession['user']
    }
}

//diff method to overwrite
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        username?: string;
        role?: string
    }
}