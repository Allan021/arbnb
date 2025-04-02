export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    profileImage?: string;
    createdAt: string;
    updatedAt: string;
}
