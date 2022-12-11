export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    taxId: string;
    physician: boolean;
    profileImage?: string;
    patient?: {
        _id?: string;
        birthday?: Date;
    },
    psychologist?: {
        _id?: string;
        taxId?: string;
    }
}
