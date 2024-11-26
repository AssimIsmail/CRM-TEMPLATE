import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { CentreService } from '../service/centre.service';
import { Centre, CentreAdd } from '../models/centre';

@Component({
  templateUrl: './centres.html',
})
export class CentresComponent implements OnInit {
  @ViewChild('addCentreModal') addCentreModal!: NgxCustomModalComponent;
  addCentreForm: FormGroup;
  centres: Centre[] = [];
  displayType = 'list';
  searchCentre = '';
  filteredCentres: Centre[] = [];
  logoFile: File | undefined;
  centreId: number | undefined;

  constructor(private fb: FormBuilder, private centreService: CentreService) {
    this.addCentreForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.getCentres();
  }

  getCentres(): void {
    this.centreService.getAllCentres().subscribe(
      (response) => {
        this.centres = response;
        this.filteredCentres = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des centres:', error);
      }
    );
  }

  filterCentres(): void {
    const searchTerm = this.searchCentre.toLowerCase();
    this.filteredCentres = this.centres.filter(centre => 
      centre.name.toLowerCase().includes(searchTerm)
    );
  }

  deleteCentre(centreId: number): void {
    this.centreService.deleteCentre(centreId).subscribe(
      () => {
        this.centres = this.centres.filter(centre => centre.id !== centreId);
        this.showMessage('Centre supprimé avec succès.');
        this.getCentres();
      },
      (error) => {
        console.error('Erreur lors de la suppression du centre:', error);
        this.showMessage('Erreur lors de la suppression du centre.', 'error');
      }
    );
  }

  openAddCentreModal() {
    this.addCentreForm.reset();
    this.logoFile = undefined;
    this.centreId = undefined;
    this.addCentreModal.open();
  }

  openUpdateCentreModal(centre: Centre) {
    this.addCentreForm.patchValue({
      name: centre.name,
      location: centre.location,
      phone: centre.phone,
      email: centre.email,
    });
    this.logoFile = undefined;
    this.centreId = centre.id;
    this.addCentreModal.open();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
    }
  }

  addCentre(): void {
    if (this.addCentreForm.valid && this.logoFile) {
      const newCentre: CentreAdd = {
        name: this.addCentreForm.value.name,
        location: this.addCentreForm.value.location,
        phone: this.addCentreForm.value.phone,
        email: this.addCentreForm.value.email,
        logo: this.logoFile,
      };

      this.centreService.createCentre(newCentre).subscribe(
        (response) => {
          console.log('Centre ajouté avec succès:', response);
          this.showMessage('Centre ajouté avec succès.');
          this.addCentreModal.close();
          this.getCentres();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du centre:', error);
          this.showMessage('Erreur lors de l\'ajout du centre.', 'error');
        }
      );
    } else {
      this.showMessage('Veuillez remplir tous les champs obligatoires et sélectionner un logo.', 'warning');
    }
  }

  updateCentre(): void {
    if (this.centreId) {
      const formData: FormData = new FormData();
      formData.append('name', this.addCentreForm.value.name);
      formData.append('location', this.addCentreForm.value.location);
      formData.append('phone', this.addCentreForm.value.phone);
      formData.append('email', this.addCentreForm.value.email);

      if (this.logoFile) {
        formData.append('logo', this.logoFile, this.logoFile.name);
      }

      this.centreService.updateCentre(this.centreId, formData).subscribe(
        () => {
          this.showMessage('Centre mis à jour avec succès.');
          this.addCentreModal.close();
          this.getCentres();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du centre:', error);
          this.showMessage('Erreur lors de la mise à jour du centre.', 'error');
        }
      );
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
