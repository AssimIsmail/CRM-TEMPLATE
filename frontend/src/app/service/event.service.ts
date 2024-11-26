import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
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
      console.log('User Data:', userData);
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

  // Create a new event
  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${environment.API}/events`, event, { headers: this.getAuthHeaders() });
  }

  // Retrieve all events
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${environment.API}/events`, { headers: this.getAuthHeaders() });
  }

  // Retrieve an event by ID
  getEventById(eventId: number): Observable<Event> {
    return this.http.get<Event>(`${environment.API}/events/${eventId}`, { headers: this.getAuthHeaders() });
  }

  // Update an event
  updateEvent(eventId: number, event: Event): Observable<Event> {
    return this.http.put<Event>(`${environment.API}/events/${eventId}`, event, { headers: this.getAuthHeaders() });
  }

  // Delete an event
  deleteEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/events/${eventId}`, { headers: this.getAuthHeaders() });
  }

  // Get events by user ID
  getEventsByUserId(userId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${environment.API}/events/user/${userId}`, { headers: this.getAuthHeaders() });
  }
}
