import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/user'; // Adjust import according to your project structure
import { Reponse } from '../models/reponse';

@Injectable({
  providedIn: 'root'
})
export class ReponseService {
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

  // Method to get user token
  private getToken(): string | null {
    return this.user?.token || null;
  }

  // Generate headers with token
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add token to header
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }
  }

  // Create a new response
  createReponse(reponse: Reponse): Observable<Reponse> {
    return this.http.post<Reponse>(`${environment.API}/reponses`, reponse, { headers: this.getAuthHeaders() });
  }

  // Retrieve all responses
  getAllReponses(): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(`${environment.API}/reponses`, { headers: this.getAuthHeaders() });
  }

  // Retrieve a response by ID
  getReponseById(reponseId: number): Observable<Reponse> {
    return this.http.get<Reponse>(`${environment.API}/reponses/${reponseId}`, { headers: this.getAuthHeaders() });
  }

  // Update a response
  updateReponse(reponseId: number, reponse: Reponse): Observable<Reponse> {
    return this.http.put<Reponse>(`${environment.API}/reponses/${reponseId}`, reponse, { headers: this.getAuthHeaders() });
  }

  // Delete a response
  deleteReponse(reponseId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/reponses/${reponseId}`, { headers: this.getAuthHeaders() });
  }

  // Get responses by user ID
  getReponsesByUserId(userId: number): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(`${environment.API}/reponses/user/${userId}`, { headers: this.getAuthHeaders() });
  }

  // Get responses for a specific question
  getReponsesByQuestionId(questionId: number): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(`${environment.API}/reponses/question/${questionId}`, { headers: this.getAuthHeaders() });
  }
}
