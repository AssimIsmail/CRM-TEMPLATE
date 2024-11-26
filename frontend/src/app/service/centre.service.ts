import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Centre, CentreAdd } from '../models/centre';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class CentreService {
  user: User = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    profile: '',
    token: ''
  };

  constructor(private router: Router, private http: HttpClient) {
    // Initialisation de l'utilisateur lors de la création du service
    const userData = sessionStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      this.router.navigate(['/login']);  // Redirection si pas d'utilisateur
    }
  }

  // Méthode pour obtenir le token de l'utilisateur
  private getToken(): string | null {
    return this.user?.token || null;
  }

  // Générer les headers avec le token
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,  // Ajouter le token à l'en-tête
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }
  }

  // Créer un nouveau centre
  createCentre(centre: CentreAdd): Observable<CentreAdd> {
    const formData: FormData = new FormData();

    // Ajoutez les champs de texte
    formData.append('name', centre.name);
    formData.append('location', centre.location);
    formData.append('phone', centre.phone);
    formData.append('email', centre.email);

    // Ajoutez le fichier logo s'il est présent
    if (centre.logo) {
      formData.append('logo', centre.logo, centre.logo.name);
    }

    // Faites l'appel HTTP avec FormData
    return this.http.post<CentreAdd>(`${environment.API}/centres`, formData, {
      headers: {
        Authorization: `Bearer ${this.getToken()}` // Ajoutez le token dans les headers
      }
    });
  }


  // Récupérer tous les centres
  getAllCentres(): Observable<Centre[]> {
    return this.http.get<Centre[]>(`${environment.API}/centres`, { headers: this.getAuthHeaders() });
  }

  // Récupérer un centre par ID
  getCentreById(centreId: number): Observable<Centre> {
    return this.http.get<Centre>(`${environment.API}/centres/${centreId}`, { headers: this.getAuthHeaders() });
  }

  // Mettre à jour un centre
  updateCentre(centreId: number, formData: FormData): Observable<Centre> {
    return this.http.put<Centre>(`${environment.API}/centres/${centreId}`, formData, {
      headers: new HttpHeaders({
        // Ne définissez pas 'Content-Type', Angular gère cela automatiquement avec FormData
        Authorization: `Bearer ${this.getToken()}` // Assurez-vous que le token est bien ajouté ici
      }),
    });
  }

  // Supprimer un centre
  deleteCentre(centreId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/centres/${centreId}`, { headers: this.getAuthHeaders() });
  }
//   getCentresByIds(ids: number[]): Observable<Centre[]> {
//     return this.http.post<Centre[]>(`${environment.API}/centres/batch`, { ids }, { headers: this.getAuthHeaders() });
// }

}
