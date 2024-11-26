import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';
import { User} from '../models/user';
import { CentreService } from '../service/centre.service';
import { Centre } from '../models/centre';

@Component({
  templateUrl: './users.html',
})
export class UsersComponent implements OnInit {
  @ViewChild('addUserModal') addUserModal!: NgxCustomModalComponent;
  @ViewChild('passwordUpdateModal') passwordUpdateModal!: NgxCustomModalComponent; // Reference to the password modal
  addUserForm: FormGroup;
  users: User[] = [];
  displayType = 'list';
  searchUser = '';
  filteredUsers: User[] = [];
  userId: number | undefined;
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
  newPassword: string = ''; // New password
  confirmPassword: string = ''; // Confirm password
  centres: Centre[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private centreService: CentreService
  ) {
    this.addUserForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: [''],
      role: ['', Validators.required],
      centreId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.getUsers();
    this.getCentres();
  }

  getUsers(): void {
    this.userService.getAllUsers().subscribe(
      (response) => {
        this.users = response;
        this.filteredUsers = response;
      },
      (error) => {
        console.error('Error retrieving users:', error);
      }
    );
  }

  getCentres(): void {
    this.centreService.getAllCentres().subscribe(
      (response) => {
        this.centres = response;
      },
      (error) => {
        console.error('Error retrieving centres:', error);
      }
    );
  }

  filterUsers(): void {
    const searchTerm = this.searchUser.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.first_name.toLowerCase().includes(searchTerm) ||
      user.last_name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe(
      () => {
        this.users = this.users.filter(user => user.id !== userId);
        this.showMessage('User deleted successfully.');
        this.getUsers();
      },
      (error) => {
        console.error('Error deleting user:', error);
        this.showMessage('Error deleting user.', 'error');
      }
    );
  }

  openAddUserModal() {
    this.addUserForm.reset();
    this.userId = undefined;
    this.addUserModal.open();
  }

  openUpdateUserModal(user: User) {
    this.userId = user.id;
    this.addUserForm.patchValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      centreId: user.centreId,
      password: ''
    });
    this.addUserModal.open();
  }

  openPasswordUpdateModal(userId: number) {
    this.userId = userId;
    this.passwordUpdateModal.open();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  onUpdateUser() {
    if (this.addUserForm.valid && this.userId) {
      const formData = new FormData();
      Object.keys(this.addUserForm.value).forEach(key => {
        if (key !== 'password' || this.addUserForm.value[key]) {
          formData.append(key, this.addUserForm.value[key]);
        }
      });
      if (this.selectedFile) {
        formData.append('profile', this.selectedFile);
      }

      this.userService.updateUser(this.userId, formData).subscribe({
        next: response => {
          console.log('Utilisateur mis à jour :', response);
          this.addUserModal.close();
          this.getUsers();
        },
        error: err => {
          console.error('Erreur :', err);
        }
      });
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }

  addUser() {
    if (this.addUserForm.valid) {
      const formData = new FormData();
      Object.keys(this.addUserForm.value).forEach(key => {
        formData.append(key, this.addUserForm.value[key]);
      });
      if (this.selectedFile) {
        formData.append('profile', this.selectedFile);
      }

      this.authService.register(formData).subscribe({
        next: response => {
          console.log('Utilisateur créé :', response);
          alert('Utilisateur ajouté avec succès !');
          this.addUserModal.close();
          this.getUsers();
        },
        error: err => {
          console.error('Erreur :', err);
          alert('Erreur lors de l\'ajout de l\'utilisateur.');
        }
      });
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }

  showMessage(msg = '', type: SweetAlertIcon = 'success') {
    Swal.fire({
      icon: type,
      title: msg,
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
    });
  }
}
