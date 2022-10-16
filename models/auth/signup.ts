export interface SignUpBody {
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
    patient?: {
        _id?: string;
    };
    psychologist?: {
        _id?: string;
        idCardNo?: string;
    }
}