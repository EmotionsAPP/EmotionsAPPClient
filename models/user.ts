export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    taxId: string;
    physician: boolean;
    patient?: {
        _id?: string;
    },
    psychologist?: {
        _id?: string;
        taxId?: string;
    }
}
