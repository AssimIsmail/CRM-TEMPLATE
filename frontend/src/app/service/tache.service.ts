import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tache } from '../models/tache'; // Assurez-vous que ce chemin est correct
import { User } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
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

  // Create a new task
  createTache(tache: Tache): Observable<Tache> {
    return this.http.post<Tache>(`${environment.API}/taches`, tache, { headers: this.getAuthHeaders() });
  }

  // Retrieve all tasks
  getAllTaches(): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${environment.API}/taches`, { headers: this.getAuthHeaders() });
  }

  // Retrieve a task by ID
  getTacheById(tacheId: number): Observable<Tache> {
    return this.http.get<Tache>(`${environment.API}/taches/${tacheId}`, { headers: this.getAuthHeaders() });
  }

  // Update a task
  updateTache(tacheId: number, tache: Tache): Observable<Tache> {
    return this.http.put<Tache>(`${environment.API}/taches/${tacheId}`, tache, { headers: this.getAuthHeaders() });
  }

  // Delete a task
  deleteTache(tacheId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/taches/${tacheId}`, { headers: this.getAuthHeaders() });
  }

  // Get tasks by user ID
  getTachesByUserId(userId: number): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${environment.API}/taches/user/${userId}`, { headers: this.getAuthHeaders() });
  }

  // Move task to trash
  moveToTrash(taskId: number): Observable<Tache> {
    return this.http.patch<Tache>(`${environment.API}/taches/${taskId}/trash`, null);
  }

  // Permanently delete task
  deleteTaskPermanently(taskId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/taches/${taskId}`);
  }
}
