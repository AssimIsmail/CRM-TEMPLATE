// src/app/services/note.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../models/note';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
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
        Authorization: `Bearer ${token}`, // Ensure token is included
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }
  }

  // Create a new note
  createNote(note: Note): Observable<Note> {
    return this.http.post<Note>(`${environment.API}/notes`, note, { headers: this.getAuthHeaders() });
  }

  // Retrieve all notes
  getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${environment.API}/notes`, { headers: this.getAuthHeaders() });
  }

  // Retrieve a note by ID
  getNoteById(noteId: number): Observable<Note> {
    return this.http.get<Note>(`${environment.API}/notes/${noteId}`, { headers: this.getAuthHeaders() });
  }

  // Update a note
  updateNote(noteId: number, note: Note): Observable<Note> {
    const headers = this.getAuthHeaders();
    console.log('Headers:', headers.keys()); // Log header keys to verify token presence
    console.log('Payload:', note);

    return this.http.put<Note>(
        `${environment.API}/notes/${noteId}`,
        note,
        { headers }
    );
  }

  // Delete a note
  deleteNote(noteId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/notes/${noteId}`, { headers: this.getAuthHeaders() });
  }

  // Get notes by user ID
  getNotesByUserId(userId: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${environment.API}/notes/user/${userId}`, { headers: this.getAuthHeaders() });
  }
}
