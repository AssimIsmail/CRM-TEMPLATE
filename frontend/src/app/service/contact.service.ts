import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: HttpClient) {}

  // Generate headers with token if needed
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token'); // Assuming token is stored in sessionStorage
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

  // Create a new contact
  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${environment.API}/contacts`, contact, { headers: this.getAuthHeaders() });
  }

  // Get all contacts
  getAllContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${environment.API}/contacts`, { headers: this.getAuthHeaders() });
  }

  // Get a contact by ID
  getContactById(contactId: number): Observable<Contact> {
    return this.http.get<Contact>(`${environment.API}/contacts/${contactId}`, { headers: this.getAuthHeaders() });
  }

  // Update a contact
  updateContact(contactId: number, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${environment.API}/contacts/${contactId}`, contact, { headers: this.getAuthHeaders() });
  }

  // Delete a contact
  deleteContact(contactId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/contacts/${contactId}`, { headers: this.getAuthHeaders() });
  }

  // Add a new contact
  addContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${environment.API}/contacts`, contact, { headers: this.getAuthHeaders() });
  }

  // Remove a contact
  removeContact(contactId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API}/contacts/${contactId}`, { headers: this.getAuthHeaders() });
  }

  // Update contact details
  updateContactDetails(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${environment.API}/contacts/${contact.id}`, contact, { headers: this.getAuthHeaders() });
  }
  getContactsByUserId(userId: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${environment.API}/contacts/user/${userId}`, { headers: this.getAuthHeaders() });
  }

  // Invite a contact by email
  inviteContactByEmail(email: string, currentUserId: number): Observable<Contact> {
    return this.http.post<Contact>(`${environment.API}/contacts/invite`, { email, currentUserId }, { headers: this.getAuthHeaders() });
  }

  // Accept a contact invitation
  acceptContactInvitation(contactId: number): Observable<Contact> {
    return this.http.post<Contact>(`${environment.API}/contacts/${contactId}/accept`, {}, { headers: this.getAuthHeaders() });
  }

  // Refuse a contact invitation
  refuseContactInvitation(contactId: number): Observable<Contact> {
    return this.http.put<Contact>(`${environment.API}/contacts/${contactId}/refuse`, {}, { headers: this.getAuthHeaders() });
  }

  // Get received invitations for a user
  getReceivedInvitations(userId: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${environment.API}/contacts/user/${userId}/received`, { headers: this.getAuthHeaders() });
  }

  // Get sent invitations for a user
  getSentInvitations(userId: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${environment.API}/contacts/user/${userId}/sent`, { headers: this.getAuthHeaders() });
  }

  cancelSentInvitation(invitationId: number): Observable<any> {
    return this.http.delete<any>(`${environment.API}/contacts/invitations/${invitationId}`);
  }
}