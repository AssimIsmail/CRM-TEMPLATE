import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Project } from '../models/project';
import { Status } from '../models/status.model';
import { catchError } from 'rxjs/operators';
import { ProjectStatus } from '../models/project-status';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
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

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${environment.API}/projects`, project, { headers: this.getAuthHeaders() });
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.API}/projects`, { headers: this.getAuthHeaders() });
  }

  getProjectById(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${environment.API}/projects/${projectId}`, { headers: this.getAuthHeaders() });
  }
  updateProject(projectId: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${environment.API}/projects/${projectId}`, project, { headers: this.getAuthHeaders() });
  }
  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/projects/${projectId}`, { headers: this.getAuthHeaders() });
  }
  creerProjetAvecStatut(idProject: number, idStatut: number): Observable<ProjectStatus> {
    const params: ProjectStatus = { projectId: idProject, statusId: idStatut };
    return this.http.post<ProjectStatus>(`${environment.API}/project-status`, params, { headers: this.getAuthHeaders() });
  }
  getStatutsParProjet(idProject: number): Observable<Status[]> {
    return this.http.get<Status[]>(`${environment.API}/project-status/statutsParProjet/${idProject}`, { headers: this.getAuthHeaders() });
  }
  
  supprimerRelation(idProject: number, idStatut: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/projects/${idProject}/statuts/${idStatut}`, { headers: this.getAuthHeaders() });
  }
}
