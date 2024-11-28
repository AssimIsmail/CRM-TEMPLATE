import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
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
import { io } from 'socket.io-client';

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
export class ChatComponent implements OnInit, OnDestroy {
    private socket: any;

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
    inviteEmail: string = '';
    inviteMessage: string = '';
    receivedInvitations: ExtendedContact[] = [];
    sentInvitations: ExtendedContact[] = [];

    ngOnInit() {
        this.socket = io('http://localhost:8081');

        const userId = this.userService.getCurrentUserId();
        if (userId !== null) {
            this.userService.getUserById(userId).subscribe({
                next: (user: User) => {
                    this.currentUser = user;
                    console.log('Current User:', this.currentUser);
                    this.loadReceivedInvitations();
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

        this.socket.on('receiveMessage', (message: any) => {
            if (this.selectedUser && this.selectedUser.contact_id === message.to_user_id || this.selectedUser.contact_id === message.from_user_id) {
                this.selectedUser.messages.push(message);
                this.scrollToBottom();
            }
        });

        this.loadSentInvitations();
    }

    ngOnDestroy() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    loadCurrentUser() {
        of(this.userService.getCurrentUserId()).pipe(
            map((userId: number | null) => userId!)
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
                this.contactList = contacts.filter(contact => contact.status === 'accepted');
                console.log('Accepted Contacts loaded:', this.contactList);
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
            const recipientId = this.selectedUser.contact_id === this.currentUser.id ? this.selectedUser.user_id : this.selectedUser.contact_id;

            const newMessage = {
                from_user_id: this.currentUser.id,
                to_user_id: recipientId,
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

                    this.socket.emit('sendMessage', message);
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

    showSection(section: string): void {
        this.currentSection = section;
        if (section === 'sentInvitations') {
            this.loadSentInvitations();
        }
    }

    acceptInvitation(invitation: ExtendedContact) {
        if (invitation.id !== undefined) {
            this.contactService.acceptContactInvitation(invitation.id).subscribe({
                next: (updatedContact) => {
                    console.log('Invitation accepted:', updatedContact);
                    this.receivedInvitations = this.receivedInvitations.filter(inv => inv.id !== invitation.id);
                    this.contactList.push(updatedContact);

                    // Fetch and update user details immediately
                    const userIdToFetch = updatedContact.user_id;
                    this.userService.getUserById(userIdToFetch).subscribe({
                        next: (user: User) => {
                            const extendedContact = updatedContact as ExtendedContact;
                            extendedContact.first_name = user.first_name;
                            extendedContact.last_name = user.last_name;
                            extendedContact.profile = typeof user.profile === 'string' ? user.profile : undefined;
                            console.log('Updated Contact with User Details:', extendedContact);
                        },
                        error: (err: any) => {
                            console.error('Error fetching user details:', err);
                        }
                    });
                },
                error: (err) => {
                    console.error('Error accepting invitation:', err);
                }
            });
        } else {
            console.warn('Invitation ID is undefined:', invitation);
        }
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

    inviteContact() {
        if (this.inviteEmail.trim()) {
            this.contactService.inviteContactByEmail(this.inviteEmail, this.currentUser?.id || 0).subscribe({
                next: (contact: Contact) => {
                    console.log('Invitation sent successfully:', contact);
                    this.inviteMessage = 'Invitation envoyée avec succès !';
                    this.inviteEmail = ''; // Clear the input after sending
                },
                error: (err: any) => {
                    console.error('Error sending invitation:', err);
                    this.inviteMessage = 'Erreur lors de l\'envoi de l\'invitation.';
                }
            });
        }
    }

    loadReceivedInvitations() {
        if (this.currentUser) {
            console.log('Current User ID:', this.currentUser.id);
            this.contactService.getReceivedInvitations(this.currentUser.id).subscribe({
                next: (invitations: ExtendedContact[]) => {
                    this.receivedInvitations = invitations;
                    console.log('Received Invitations:', this.receivedInvitations);

                    this.receivedInvitations.forEach(invitation => {
                        const userIdToFetch = invitation.user_id;
                        console.log('Fetching user details for ID:', userIdToFetch);
                        this.userService.getUserById(userIdToFetch).subscribe({
                            next: (user: User) => {
                                invitation.first_name = user.first_name;
                                invitation.last_name = user.last_name;
                                invitation.profile = typeof user.profile === 'string' ? user.profile : undefined;
                                console.log('Updated Invitation:', invitation);
                            },
                            error: (err: any) => {
                                console.error('Error fetching user details:', err);
                            }
                        });
                    });

                    console.log('Final Received Invitations with User Details:', this.receivedInvitations);
                },
                error: (err: any) => {
                    console.error('Error fetching received invitations:', err);
                }
            });
        } else {
            console.warn('Current user is not defined.');
        }
    }

    loadSentInvitations() {
        if (this.currentUser) {
            this.contactService.getSentInvitations(this.currentUser.id).subscribe({
                next: (invitations: ExtendedContact[]) => {
                    this.sentInvitations = invitations;
                    console.log('Sent Invitations:', this.sentInvitations);

                    this.sentInvitations.forEach(invitation => {
                        const userIdToFetch = invitation.user_id;
                        console.log('Fetching user details for ID:', userIdToFetch);
                        this.userService.getUserById(userIdToFetch).subscribe({
                            next: (user: User) => {
                                invitation.first_name = user.first_name;
                                invitation.last_name = user.last_name;
                                invitation.profile = typeof user.profile === 'string' ? user.profile : undefined;
                                console.log('Updated Sent Invitation:', invitation);
                            },
                            error: (err: any) => {
                                console.error('Error fetching user details:', err);
                            }
                        });
                    });
                },
                error: (err: any) => {
                    console.error('Error fetching sent invitations:', err);
                }
            });
        } else {
            console.warn('Current user is not defined.');
        }
    }

    cancelInvitation(invitation: ExtendedContact) {
        if (invitation.id !== undefined) {
            this.contactService.cancelSentInvitation(invitation.id).subscribe({
                next: () => {
                    console.log('Invitation annulée:', invitation);
                    this.loadSentInvitations();
                },
                error: (err) => {
                    console.error('Erreur lors de l\'annulation de l\'invitation:', err);
                }
            });
        } else {
            console.warn('Invitation ID is undefined:', invitation);
        }
    }
}
