import { User } from "./user";

export interface Article {
    _id?: string;
    title?: string;
    body?: string;
    createdAt?: Date;
    isActive?: boolean;
    psychologist?: User;
}