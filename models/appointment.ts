export interface Appointment {
    _id?: string;
    psychologist: any;
    patient: any; 
    start: string;
    end: string;
    description?: string;
    started?: boolean;
    completed?: boolean;
    started_at?: Date;
    completed_at?: Date;
    created_at?: Date; 
    updated_at?: Date;
    updated_by?: string;
    status: string;
}