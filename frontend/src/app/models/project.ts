export interface Project {
    id: number;
    name: string;
    description: string;
    start_date: Date;
    end_date: Date;
    centreId: number | null; // Assuming this is optional or nullable
  }
  