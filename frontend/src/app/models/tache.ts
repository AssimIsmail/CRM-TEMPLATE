export interface Tache {
    id: number; 
    title: string;
    description: string;
    date: string;              
    priority: string;
    status: string;
    userId: number;
    tag: string;
    path: string;
    assignee: string;
    trashed?: boolean; // New field to indicate if the task is trashed

}
