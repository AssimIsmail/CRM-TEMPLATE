import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  user: any = {
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
  // Récupérer le nombre de clients ajoutés chaque jour

  // Method to retrieve token
  private getToken(): string | null {
    return this.user?.token || null;
  }

  // Method to set Authorization headers with token
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,  // Include token in headers
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }
  }

  // Create a new client
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${environment.API}/offres`, client, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get all clients
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${environment.API}/offres`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get a client by ID
  getClientById(clientId: number): Observable<Client> {
    return this.http.get<Client>(`${environment.API}/offres/${clientId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Update a client
  updateClient(clientId: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${environment.API}/offres/${clientId}`, client, {
      headers: this.getAuthHeaders(),
    });
  }

  // Delete a client
  deleteClient(clientId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/offres/${clientId}`, {
      headers: this.getAuthHeaders(),
    });
  }
  getClientsWithStatusCloseCount(): Observable<number[]> {
    return this.http.get<number[]>(`${environment.API}/offres/status/close/daily-count`, {
        headers: this.getAuthHeaders(),
    });
}
  getClientsWithStatusDailyCount(statusName: string): Observable<number[]> {
    return this.http.get<number[]>(`${environment.API}/offres/status/${statusName}/daily-count`, {
      headers: this.getAuthHeaders(),
    });
  }
  getDailyClientCount(): Observable<number[]> {
    return this.http.get<number[]>(`${environment.API}/offres/daily-count`, {
      headers: this.getAuthHeaders(),
    });
  }
  getClientsCountByStatusAndMonth(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API}/offres/status-monthly-count`, {
      headers: this.getAuthHeaders(),
    });
  }
}
