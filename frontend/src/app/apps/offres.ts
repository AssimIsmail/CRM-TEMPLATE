import { Component, ViewChild, OnInit } from '@angular/core';
import { ClientService } from 'src/app/service/client.service';
import { Client } from 'src/app/models/client';
import { EnregistrementService } from 'src/app/service/enregistrement.service';
import { Enregistrement } from 'src/app/models/enregistrement';
import { UserService } from 'src/app/service/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    templateUrl: './offres.html',
})
export class OffresComponent implements OnInit {
    @ViewChild('datatable') datatable: any;
    search = '';
    items: Client[] = [];
    showModal = false;
    newEnregistrement: Enregistrement = { id: 0, url: '', userId: 0, clientId: 0 };
    @ViewChild('enregistrementModal') enregistrementModal: any;
    selectedFile: File | null = null;
    enregistrementForm: FormGroup;
    clientEnregistrements: Enregistrement[] = [];
    @ViewChild('recordingsModal') recordingsModal: any;

    constructor(
        private clientService: ClientService,
        private enregistrementService: EnregistrementService,
        private userService: UserService,
        private fb: FormBuilder
    ) {
        this.enregistrementForm = this.fb.group({
            userId: [this.newEnregistrement.userId],
            clientId: [this.newEnregistrement.clientId]
        });
    }

    ngOnInit() {
        this.loadClients();
        this.setCurrentUserId();
    }

    setCurrentUserId() {
        const currentUser = this.userService.getCurrentUserId();
        if (currentUser) {
            this.newEnregistrement.userId = currentUser;
        }
    }

    loadClients() {
        this.clientService.getAllClients().subscribe(
            (clients: Client[]) => {
                console.log('Loaded clients:', clients);
                this.items = clients;
            },
            (error: any) => {
                console.error('Error loading clients', error);
            }
        );
    }

    deleteRow(item: any = null) {
        if (confirm('Are you sure want to delete selected row?')) {
            if (item) {
                this.clientService.deleteClient(item).subscribe(() => {
                    this.items = this.items.filter((d: Client) => d.id !== item);
                    this.datatable.clearSelectedRows();
                });
            } else {
                let selectedRows = this.datatable.getSelectedRows();
                const ids = selectedRows.map((d: any) => d.id);
                ids.forEach((id: number) => {
                    this.clientService.deleteClient(id).subscribe(() => {
                        this.items = this.items.filter((d: Client) => !ids.includes(d.id));
                        this.datatable.clearSelectedRows();
                    });
                });
            }
        }
    }

    openEnregistrementModal(clientId: number) {
        this.newEnregistrement.clientId = clientId;
        this.enregistrementModal.open();
    }

    closeModal() {
        this.enregistrementModal.close();
    }

    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            console.log('Selected file:', this.selectedFile);
        }
    }

    createEnregistrement() {
        if (this.enregistrementForm.valid && this.selectedFile) {
            const formData: FormData = new FormData();
            formData.append('file', this.selectedFile);
            formData.append('userId', this.newEnregistrement.userId.toString());
            formData.append('clientId', this.newEnregistrement.clientId.toString());

            console.log('FormData:', {
                file: this.selectedFile,
                userId: this.newEnregistrement.userId,
                clientId: this.newEnregistrement.clientId
            });

            this.enregistrementService.createEnregistrement(formData).subscribe(
                (response) => {
                    console.log('Enregistrement created:', response);
                    this.closeModal();
                },
                (error) => {
                    console.error('Error creating enregistrement', error);
                }
            );
        } else {
            console.error('Form is invalid or file not selected');
        }
    }

    openRecordingsModal(clientId: number) {
        this.enregistrementService.getEnregistrementsByClientId(clientId).subscribe(
            (enregistrements: Enregistrement[]) => {
                this.clientEnregistrements = enregistrements;
                this.recordingsModal.open();
            },
            (error) => {
                console.error('Error loading enregistrements', error);
            }
        );
    }

    deleteEnregistrement(enregistrementId: number) {
        if (confirm('Are you sure you want to delete this enregistrement?')) {
            this.enregistrementService.deleteEnregistrement(enregistrementId).subscribe(
                () => {
                    this.clientEnregistrements = this.clientEnregistrements.filter(e => e.id !== enregistrementId);
                },
                (error) => {
                    console.error('Error deleting enregistrement', error);
                }
            );
        }
    }
}
