import { User } from "./user";

export interface Article {
    title: string;
    body: string;
    createdAt?: Date;
    isActive?: boolean;
    psychologist?: User | string;
}