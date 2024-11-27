import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
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
    const userData = sessionStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      this.router.navigate(['/login']);
    }
  }

  private getToken(): string | null {
    return this.user?.token || null;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }
  }

  // Créer un nouveau message
  createMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${environment.API}/messages`, message, { headers: this.getAuthHeaders() });
  }

  // Récupérer tous les messages
  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.API}/messages`, { headers: this.getAuthHeaders() });
  }

  // Récupérer un message par ID
  getMessageById(messageId: number): Observable<Message> {
    return this.http.get<Message>(`${environment.API}/messages/${messageId}`, { headers: this.getAuthHeaders() });
  }

  // Mettre à jour un message
  updateMessage(messageId: number, message: Message): Observable<Message> {
    return this.http.put<Message>(`${environment.API}/messages/${messageId}`, message, { headers: this.getAuthHeaders() });
  }

  // Supprimer un message
  deleteMessage(messageId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/messages/${messageId}`, { headers: this.getAuthHeaders() });
  }

  // Récupérer les messages entre deux utilisateurs
  getMessagesBetweenUsers(fromUserId: number, toUserId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.API}/messages/between/${fromUserId}/${toUserId}`, { headers: this.getAuthHeaders() });
  }
}