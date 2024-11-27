export interface Contact {
  id?: number; // Optional, as it might not be set for new contacts
  user_id: number;
  contact_id: number;
  last_message_time?: Date; // Optional, as it might not always be set
  last_message_preview?: string; // Optional, as it might not always be set
}