import { Component, ViewChild, OnInit } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusService } from '../service/status.service';
import { Status } from '../models/status.model';

@Component({
  templateUrl: './status.html',
  animations: [toggleAnimation],
})
export class StatusComponent implements OnInit {
  @ViewChild('addStatusModal') addStatusModal!: NgxCustomModalComponent;
  addStatusForm: FormGroup;
  statuses: Status[] = [];
  displayType = 'list';
  searchStatus = '';
  filteredStatuses: Status[] = [];
  statusId: number | undefined;

  constructor(private fb: FormBuilder, private statusService: StatusService) {
    this.addStatusForm = this.fb.group({
      name: ['', Validators.required],
      color: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getStatuses();
  }

  getStatuses(): void {
    this.statusService.getAllStatuses().subscribe(
      (response) => {
        this.statuses = response;
        this.filteredStatuses = response;
      },
      (error) => {
        console.error('Error fetching statuses:', error);
      }
    );
  }

  filterStatuses(): void {
    const searchTerm = this.searchStatus.toLowerCase();
    this.filteredStatuses = this.statuses.filter(status => 
      status.name.toLowerCase().includes(searchTerm)
    );
  }

  openAddStatusModal() {
    this.addStatusForm.reset();
    this.statusId = undefined;
    this.addStatusModal.open();
  }

  openUpdateStatusModal(status: Status) {
    this.addStatusForm.patchValue({
      name: status.name,
      color: status.color,
    });
    this.statusId = status.id;
    this.addStatusModal.open();
  }

  addStatus(): void {
    if (this.addStatusForm.valid) {
      const newStatus: Status = {
        id: 0, // Default ID or managed by backend
        name: this.addStatusForm.value.name,
        color: this.addStatusForm.value.color,
      };

      this.statusService.createStatus(newStatus).subscribe(
        (response) => {
          console.log('Status added successfully:', response);
          this.showMessage('Status added successfully.');
          this.addStatusModal.close();
          this.getStatuses();
        },
        (error) => {
          console.error('Error adding status:', error);
          this.showMessage('Error adding status.', 'error');
        }
      );
    } else {
      this.showMessage('Please fill in all required fields.', 'warning');
    }
  }

  updateStatus(): void {
    if (this.statusId) {
      const updatedStatus: Status = {
        id: this.statusId,
        name: this.addStatusForm.value.name,
        color: this.addStatusForm.value.color,
      };

      this.statusService.updateStatus(this.statusId, updatedStatus).subscribe(
        () => {
          this.showMessage('Status updated successfully.');
          this.addStatusModal.close();
          this.getStatuses();
        },
        (error) => {
          console.error('Error updating status:', error);
          this.showMessage('Error updating status.', 'error');
        }
      );
    }
  }

  deleteStatus(statusId: number): void {
    this.statusService.deleteStatus(statusId).subscribe(
      () => {
        this.statuses = this.statuses.filter(status => status.id !== statusId);
        this.showMessage('Status deleted successfully.');
        this.getStatuses();
      },
      (error) => {
        console.error('Error deleting status:', error);
        this.showMessage('Error deleting status.', 'error');
      }
    );
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

