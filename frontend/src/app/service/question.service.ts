import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/user'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
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
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '', // Add token to header if available
    });
  }

  // Create a new question
  createQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(`${environment.API}/questions`, question, { headers: this.getAuthHeaders() });
  }

  // Retrieve all questions
  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${environment.API}/questions`, { headers: this.getAuthHeaders() });
  }

  // Retrieve a question by ID
  getQuestionById(questionId: number): Observable<Question> {
    return this.http.get<Question>(`${environment.API}/questions/${questionId}`, { headers: this.getAuthHeaders() });
  }

  // Update a question
  updateQuestion(questionId: number, question: Question): Observable<Question> {
    return this.http.put<Question>(`${environment.API}/questions/${questionId}`, question, { headers: this.getAuthHeaders() });
  }

  // Delete a question
  deleteQuestion(questionId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/questions/${questionId}`, { headers: this.getAuthHeaders() });
  }

  // Get questions by user ID
  getQuestionsByUserId(userId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${environment.API}/questions/user/${userId}`, { headers: this.getAuthHeaders() });
  }
}
