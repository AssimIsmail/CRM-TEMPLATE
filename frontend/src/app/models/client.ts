export interface Client {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    otherphone?: string; 
    address: string;
    commantaire_prospecteur: string;
    commantaire_vendeur: string;
    centreId?: number | null;
    projectId?: number | null;
    statusId?: number | null;
    prospecteurId?: number | null;
    vendeurId?: number | null;
  }
  