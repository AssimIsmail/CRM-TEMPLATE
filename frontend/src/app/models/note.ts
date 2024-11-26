export interface Note {
    id: number;               // Corresponds to the long id in Java
    userId: number;           // Corresponds to the user_id from the NoteDTO
    thumb?: string;           // Optional thumbnail
    title: string;            // Title of the note, cannot be null
    description?: string;     // Optional description
    date: string;             // Date of the note, can be a string or Date object
    isFav: boolean;           // Indicates if the note is favorited
    tag?: string;             // Optional tag
}
export interface NoteWithUserName {
    // ... existing properties ...
    userProfile: string; // Add this line
    // ... existing properties ...
}