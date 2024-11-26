import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    // Récupération du token depuis le sessionStorage
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.token = user.token; // Stockage du token
    } else {
      this.router.navigate(['/login']); // Redirection si aucune donnée utilisateur
    }
  }

  // Méthode pour obtenir les en-têtes avec le token
  private getAuthHeaders(): HttpHeaders {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.token) {
      return headers.append('Authorization', `Bearer ${this.token}`); // Ajout du token
    }
    return headers; // Retourne les en-têtes sans le token si non disponible
  }

  updateUser(id: number, formData: FormData): Observable<User> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }); // Only authorization header
    return this.http.put<User>(`${environment.API}/users/${id}`, formData, { headers });
  }

  // updateUserWithImage(id: number, formData: FormData): Observable<User> {
  //   const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }); // Seulement l'en-tête d'autorisation
  //   return this.http.put<User>(`${environment.API}/users/${id}`, formData, { headers });
  // }
  getCurrentUserId(): number | null {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.id; // Assuming the user object has an 'id' property
    }
    return null; // Return null if no user is found
  }
  // // Nouvelle méthode pour mettre à jour le profil sans changer le mot de passe
  // updateUserProfile(id: number, formData: FormData): Observable<User> {
  //   const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
  //   return this.http.put<User>(`${environment.API}/users/${id}/profile`, formData, { headers });
  // }



//   updatePassword(id: number, password: Password): Observable<any> {

//     return this.http.put<any>(`${environment.API}/users/${id}/password`, password, { headers: this.getAuthHeaders() });
// }




  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.API}/users/${id}`, { headers: this.getAuthHeaders() });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.API}/users`, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/users/${id}`, { headers: this.getAuthHeaders() });
  }
  // Nouvelle méthode : filtrer les utilisateurs par rôle dans le front-end
  getUsersByRole(roles: string[]): Observable<User[]> {
    return new Observable(observer => {
      this.getAllUsers().subscribe(users => {
        const filteredUsers = users.filter(user => roles.includes(user.role.toUpperCase()));
        observer.next(filteredUsers);
        observer.complete();
      });
    });
  }
//   getUsersByIds(ids: number[]): Observable<User[]> {
//     return this.http.post<User[]>(`${environment.API}/users/batch`, { ids }, { headers: this.getAuthHeaders() });
// }

}
