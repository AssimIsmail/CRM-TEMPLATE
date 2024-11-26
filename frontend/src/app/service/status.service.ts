import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Status } from '../models/status.model'; // Assure-toi que le chemin d'importation est correct
import { Router } from '@angular/router';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
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

  // Créer un nouveau statut
  createStatus(status: Status): Observable<Status> {
    return this.http.post<Status>(`${environment.API}/statuses`, status, { headers: this.getAuthHeaders() });
  }

  // Récupérer tous les statuts
  getAllStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(`${environment.API}/statuses`, { headers: this.getAuthHeaders() });
  }

  // Récupérer un statut par ID
  getStatusById(statusId: number): Observable<Status> {
    return this.http.get<Status>(`${`${environment.API}/statuses`}/${statusId}`, { headers: this.getAuthHeaders() });
  }

  // Mettre à jour un statut
  updateStatus(statusId: number, status: Status): Observable<Status> {
    return this.http.put<Status>(`${`${environment.API}/statuses`}/${statusId}`, status, { headers: this.getAuthHeaders() });
  }

  // Supprimer un statut
  deleteStatus(statusId: number): Observable<void> {
    return this.http.delete<void>(`${`${environment.API}/statuses`}/${statusId}`, { headers: this.getAuthHeaders() });
  }
//   getStatusesByIds(ids: number[]): Observable<Status[]> {
//     return this.http.post<Status[]>(`${environment.API}/status/batch`, { ids }, { headers: this.getAuthHeaders() });
// }

}
