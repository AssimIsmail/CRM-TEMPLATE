import { Reponse } from "./reponse";

// question.dto.ts
export interface Question {
    id: number 
    titre: string;
    contenu: string;
    dateCreation: Date
    userId: number


    responses?: Reponse[]; // Propriété pour stocker les réponses
    showResponses?: boolean; // Propriété pour gérer l'affichage des réponses

    run(): void; // Ajout de la méthode run
  }
  