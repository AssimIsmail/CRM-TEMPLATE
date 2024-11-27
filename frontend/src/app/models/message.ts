export interface Message {
    id?: number;
    from_user_id: number;
    to_user_id: number;
    text: string;
    time?: Date;
    is_read?: boolean;
  }