import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enregistrement } from '../models/enregistrement'; // The model for Enregistrement
import { environment } from '../../environments/environment'; // Environment variables
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class EnregistrementService {
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
    // Initialize user on service creation
    const userData = sessionStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      this.router.navigate(['/login']); // Redirect if no user
    }
  }

  // Method to get the user's token
  private getToken(): string | null {
    return this.user?.token || null;
  }

  // Generate headers with the token
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add token to headers
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }
  }

  createEnregistrement(formData: FormData): Observable<Enregistrement> {
    return this.http.post<Enregistrement>(`${environment.API}/enregistrements`, formData, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });
  }
  
  // Retrieve all enregistrements
  getAllEnregistrements(): Observable<Enregistrement[]> {
    return this.http.get<Enregistrement[]>(`${environment.API}/enregistrements`, {
      headers: this.getAuthHeaders() 
    });
  }

  // Retrieve an enregistrement by ID
  getEnregistrementById(id: number): Observable<Enregistrement> {
    return this.http.get<Enregistrement>(`${environment.API}/enregistrements/${id}`, {
      headers: this.getAuthHeaders() // Add token to headers
    });
  }

  // Update an enregistrement
  updateEnregistrement(id: number, enregistrement: Enregistrement): Observable<Enregistrement> {
    return this.http.put<Enregistrement>(`${environment.API}/enregistrements/${id}`, enregistrement, {
      headers: this.getAuthHeaders() // Add token to headers
    });
  }
  

  // Delete an enregistrement
  deleteEnregistrement(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/enregistrements/${id}`, {
      headers: this.getAuthHeaders() // Add token to headers
    });
  }
  getEnregistrementsByClientId(clientId: number): Observable<Enregistrement[]> {
    return this.http.get<Enregistrement[]>(`${environment.API}/enregistrements/client/${clientId}`, {
      headers: this.getAuthHeaders() // Ajouter le token aux headers
    });
  }
}
