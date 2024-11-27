import { Component, ViewChild } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import { NgScrollbar } from 'ngx-scrollbar';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/service/user.service';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ContactService } from 'src/app/service/contact.service';
import { Contact } from '../models/contact';
import { MessageService } from 'src/app/service/message.service';

// Extend the Contact interface
interface ExtendedContact extends Contact {
    first_name?: string;
    last_name?: string;
    profile?: string;
}

@Component({
    templateUrl: './chat.html',
    animations: [toggleAnimation],
})
export class ChatComponent {
    constructor(
        public storeData: Store<any>,
        private userService: UserService,
        private contactService: ContactService,
        private messageService: MessageService
    ) {
        this.initStore();
        this.loadCurrentUser();
    }
    store: any;
    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }
    @ViewChild('scrollable') scrollable!: NgScrollbar;
    isShowUserChat = false;
    isShowChatMenu = false;
    loginUser = {
        id: 0,
        name: 'Alon Smith',
        path: 'profile-34.jpeg',
        designation: 'Software Developer',
    };
    contactList: ExtendedContact[] = [];
    searchUser = '';
    textMessage = '';
    selectedUser: any = null;
    currentSection: string = 'contacts'; // Default section
    invitations = [
        {
            userId: 2,
            name: 'John Doe',
            path: 'profile-20.jpeg',
            time: '1:00 PM',
            preview: 'Invitation to connect',
            active: false,
        },
        // Add more invitation objects as needed
    ];
    currentUser: User | null = null;

    loadCurrentUser() {
        of(this.userService.getCurrentUserId()).pipe(
            map((userId: number | null) => userId)
        ).subscribe({
            next: (userId: number | null) => {
                if (userId !== null) {
                    this.userService.getUserById(userId).subscribe({
                        next: (user: User) => {
                            this.currentUser = user;
                            this.loadContacts(user.id);
                            console.log('Current User:', this.currentUser);
                        },
                        error: (err: any) => {
                            console.error('Error fetching user by ID:', err);
                            this.currentUser = null;
                        }
                    });
                } else {
                    console.warn('No user ID found in session storage.');
                    this.currentUser = null;
                }
            },
            error: (err: any) => {
                console.error('Error fetching current user ID:', err);
                this.currentUser = null;
            }
        });
    }

    loadContacts(userId: number) {
        this.contactService.getContactsByUserId(userId).subscribe({
            next: (contacts: ExtendedContact[]) => {
                this.contactList = contacts;
                console.log('Contacts loaded:', this.contactList);
                this.contactList.forEach(contact => {
                    const idToFetch = contact.contact_id === userId ? contact.user_id : contact.contact_id;
                    console.log('Fetching user details for ID:', idToFetch);
                    this.userService.getUserById(idToFetch).subscribe({
                        next: (user: User) => {
                            contact.first_name = user.first_name;
                            contact.last_name = user.last_name;
                            contact.profile = typeof user.profile === 'string' ? user.profile : undefined;
                        },
                        error: (err: any) => {
                            console.error('Error fetching user details:', err);
                        }
                    });
                });
            },
            error: (err: any) => {
                console.error('Error fetching contacts:', err);
            }
        });
    }

    searchUsers() {
        return this.contactList.filter((d: ExtendedContact) => {
            return d.user_id.toString().includes(this.searchUser.toLowerCase());
        });
    }

    selectUser(contact: any) {
        console.log('Contact selected:', contact);
        this.selectedUser = contact;
        console.log('Selected Contact ID:', this.selectedUser.contact_id);

        this.isShowUserChat = true;
        this.loadMessages();
        this.scrollToBottom();
        this.isShowChatMenu = false;
    }

    sendMessage() {
        if (this.textMessage.trim() && this.currentUser && this.selectedUser) {
            const newMessage = {
                from_user_id: this.currentUser.id,
                to_user_id: this.selectedUser.contact_id,
                text: this.textMessage,
                time: new Date(),
                is_read: false
            };

            this.messageService.createMessage(newMessage).subscribe({
                next: (message) => {
                    console.log('Message sent successfully:', message);
                    this.selectedUser.messages.push(message);
                    this.textMessage = '';
                    this.scrollToBottom();
                },
                error: (err) => {
                    console.error('Error sending message:', err);
                }
            });
        }
    }

    scrollToBottom() {
        if (this.isShowUserChat) {
            setTimeout(() => {
                this.scrollable.scrollTo({ bottom: 0 });
            });
        }
    }

    showSection(section: string) {
        this.currentSection = section;
    }

    acceptInvitation(invitation: any) {
        // Logic to accept the invitation
        console.log('Invitation accepted:', invitation);
        // Optionally, move the invitation to contacts
    }

    loadMessages() {
        if (this.selectedUser && this.currentUser) {
            const contactId = this.selectedUser.contact_id === this.currentUser.id ? this.selectedUser.user_id : this.selectedUser.contact_id;
            
            console.log('Login User ID:', this.currentUser.id);
            console.log('Selected Contact ID:', contactId);

            this.messageService.getMessagesBetweenUsers(this.currentUser.id, contactId).subscribe({
                next: (messages) => {
                    this.selectedUser.messages = messages;
                    console.log('Messages for selected contact:', messages);
                },
                error: (err) => {
                    console.error('Error fetching messages:', err);
                }
            });
        }
    }
}
