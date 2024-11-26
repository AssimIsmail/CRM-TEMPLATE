import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<User> {
    return this.http.post<User>(`${environment.API_AUTH}/login`, credentials);
  }

  register(user: FormData): Observable<User> {
    return this.http.post<User>(`${environment.API_AUTH}/register`, user);
  }
}
