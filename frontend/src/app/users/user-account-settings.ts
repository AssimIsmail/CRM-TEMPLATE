import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { CentreService } from '../service/centre.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Centre } from '../models/centre';

@Component({
    templateUrl: './user-account-settings.html',
})
export class UserAccountSettingsComponent implements OnInit {
    activeTab = 'home';
    userForm: FormGroup;
    centres: Centre[] = [];
    currentUser: User | null = null;
    userRoles: string[] = [
        'SUPER_ADMIN',
        'ADMIN',
        'SOUS_ADMIN',
        'PARTENAIRE',
        'VENDEUR',
        'PROSPECTEUR',
        'USER'
    ];
    selectedFile: File | null = null;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private centreService: CentreService,
        private router: Router
    ) {
        this.userForm = this.fb.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            role: ['', Validators.required],
            centreId: [null, Validators.required],
            profile: [null],
            password: ['']
        });
    }

    ngOnInit() {
        this.loadCurrentUser();
        this.getCentres();
    }

    loadCurrentUser() {
        const userId = this.userService.getCurrentUserId();
        if (userId !== null) {
            this.userService.getUserById(userId).subscribe(user => {
                this.currentUser = user;
                this.userForm.patchValue({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    centreId: user.centreId,
                    password: ''
                });
            });
        }
    }

    getCentres() {
        this.centreService.getAllCentres().subscribe(
            (response) => {
                this.centres = response;
            },
            (error) => {
                console.error('Error retrieving centres:', error);
            }
        );
    }

    onFileSelected(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          this.selectedFile = target.files[0];
        }
      }

    onUpdateUser() {
        if (this.userForm.valid && this.currentUser) {
            const formData = new FormData();
            Object.keys(this.userForm.value).forEach(key => {
                if (key !== 'password' || (this.userForm.value[key] && this.userForm.value[key].trim() !== '')) {
                    formData.append(key, this.userForm.value[key]);
                }
            });
            if (this.selectedFile) {
                formData.append('profile', this.selectedFile);
            }

            this.userService.updateUser(this.currentUser.id, formData).subscribe({
                next: response => {
                    console.log('User updated:', response);
                    alert('User updated successfully!');
                    this.router.navigate(['/users/profile']);
                },
                error: err => {
                    console.error('Error:', err);
                    alert('Error updating user.');
                }
            });
        } else {
            alert('Please fill in all required fields.');
        }
    }

    canUpdateRoleAndCentre(): boolean {
        return this.currentUser?.role === 'SUPER_ADMIN' || this.currentUser?.role === 'ADMIN';
    }
}
