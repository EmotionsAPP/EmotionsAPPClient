export interface SignUpBody {
    email: string; 
    password: string; 
    firstName: string; 
    taxId: string;
    physician?: boolean;
    lastName: string; 
    createdAt?: Date; 
    updatedAt?: Date; 
    updatedBy?: string;
}