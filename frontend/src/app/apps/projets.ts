import { Component, ViewChild, OnInit } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../service/project.service';
import { Project } from '../models/project';
import { Status } from '../models/status.model';
import { StatusService } from '../service/status.service';
import { Centre } from '../models/centre';
import { CentreService } from '../service/centre.service';

@Component({
  templateUrl: './projets.html',
  animations: [toggleAnimation],
})
export class ProjectsComponent implements OnInit {
  @ViewChild('addProjectModal') addProjectModal!: NgxCustomModalComponent;
  @ViewChild('assignStatusModal') assignStatusModal!: NgxCustomModalComponent;
  @ViewChild('viewStatusesModal') viewStatusesModal!: NgxCustomModalComponent;
  addProjectForm: FormGroup;
  projects: Project[] = [];
  displayType = 'list';
  searchProject = '';
  filteredProjects: Project[] = [];
  projectId: number | undefined;
  statuses: Status[] = [];
  selectedStatusId: number | undefined;
  currentProjectId: number | undefined;
  assignedStatuses: Status[] = [];
  centres: Centre[] = [];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private statusService: StatusService,
    private centreService: CentreService
  ) {
    this.addProjectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: [''],
      centreId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.getProjects();
    this.getStatuses();
    this.getCentres();
  }

  getProjects(): void {
    this.projectService.getAllProjects().subscribe(
      (response) => {
        this.projects = response;
        this.filteredProjects = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des projets:', error);
      }
    );
  }

  filterProjects(): void {
    const searchTerm = this.searchProject.toLowerCase();
    this.filteredProjects = this.projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm)
    );
  }

  deleteProject(projectId: number): void {
    this.projectService.deleteProject(projectId).subscribe(
      () => {
        this.projects = this.projects.filter(project => project.id !== projectId);
        this.showMessage('Projet supprimé avec succès.');
        this.getProjects();
      },
      (error) => {
        console.error('Erreur lors de la suppression du projet:', error);
        this.showMessage('Erreur lors de la suppression du projet.', 'error');
      }
    );
  }

  openAddProjectModal() {
    this.addProjectForm.reset();
    this.projectId = undefined;
    this.addProjectModal.open();
  }

  openUpdateProjectModal(project: Project) {
    this.addProjectForm.patchValue({
      name: project.name,
      description: project.description,
      start_date: (project.start_date instanceof Date ? project.start_date : new Date(project.start_date)).toISOString().split('T')[0],
      end_date: (project.end_date instanceof Date ? project.end_date : new Date(project.end_date)).toISOString().split('T')[0],
      centreId: project.centreId
    });
    this.projectId = project.id;
    this.addProjectModal.open();
  }

  addProject(): void {
    if (this.addProjectForm.valid) {
      const newProject: Project = {
        id: 0, // or some default value
        name: this.addProjectForm.get('name')?.value,
        description: this.addProjectForm.get('description')?.value,
        start_date: this.addProjectForm.get('start_date')?.value,
        end_date: this.addProjectForm.get('end_date')?.value,
        centreId: this.addProjectForm.get('centreId')?.value, // Ensure centreId is set
      };

      this.projectService.createProject(newProject).subscribe(
        (response) => {
          console.log('Projet ajouté avec succès:', response);
          this.showMessage('Projet ajouté avec succès.');
          this.addProjectModal.close();
          this.getProjects();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du projet:', error);
          this.showMessage('Erreur lors de l\'ajout du projet.', 'error');
        }
      );
    } else {
      this.showMessage('Veuillez remplir tous les champs obligatoires.', 'warning');
    }
  }

  updateProject(): void {
    if (this.addProjectForm.valid && this.projectId !== undefined) {
      const updatedProject: Project = {
        id: this.projectId, // Assuming projectId is set when editing
        name: this.addProjectForm.get('name')?.value,
        description: this.addProjectForm.get('description')?.value,
        start_date: this.addProjectForm.get('start_date')?.value,
        end_date: this.addProjectForm.get('end_date')?.value,
        centreId: this.addProjectForm.get('centreId')?.value, // Ensure centreId is set
      };

      this.projectService.updateProject(this.projectId, updatedProject).subscribe(
        () => {
          this.showMessage('Projet mis à jour avec succès.');
          this.addProjectModal.close();
          this.getProjects();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du projet:', error);
          this.showMessage('Erreur lors de la mise à jour du projet.', 'error');
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

  getStatuses(): void {
    this.statusService.getAllStatuses().subscribe(
      (response) => {
        this.statuses = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des statuts:', error);
      }
    );
  }

  openAssignStatusModal(project: Project): void {
    this.currentProjectId = project.id;
    this.selectedStatusId = undefined;
    this.getAssignedStatuses(project.id);
    this.assignStatusModal.open();
  }

  getAssignedStatuses(projectId: number): void {
    this.projectService.getStatutsParProjet(projectId).subscribe(
      (response) => {
        this.assignedStatuses = response;
        this.filterAvailableStatuses();
      },
      (error) => {
        console.error('Erreur lors de la récupération des statuts affectés:', error);
      }
    );
  }

  filterAvailableStatuses(): void {
    const assignedStatusIds = this.assignedStatuses.map(status => status.id);
    this.statuses = this.statuses.filter(status => !assignedStatusIds.includes(status.id));
  }

  assignStatus(): void {
    if (this.currentProjectId && this.selectedStatusId) {
      this.projectService.creerProjetAvecStatut(this.currentProjectId, this.selectedStatusId).subscribe(
        () => {
          this.showMessage('Statut affecté avec succès.');
          this.assignStatusModal.close();
          this.getProjects();
        },
        (error) => {
          console.error('Erreur lors de l\'affectation du statut:', error);
          this.showMessage('Erreur lors de l\'affectation du statut.', 'error');
        }
      );
    }
  }

  openViewStatusesModal(project: Project): void {
    this.currentProjectId = project.id;
    this.getAssignedStatuses(project.id);
    this.viewStatusesModal.open();
  }

  deleteStatusFromProject(projectId: number, statusId: number): void {
    this.projectService.supprimerRelation(projectId, statusId).subscribe(
      () => {
        this.showMessage('Statut supprimé avec succès.');
        this.getAssignedStatuses(projectId); // Refresh the list of assigned statuses
        this.getStatuses(); // Refresh the list of all statuses
      },
      (error) => {
        console.error('Erreur lors de la suppression du statut:', error);
        this.showMessage('Erreur lors de la suppression du statut.', 'error');
      }
    );
  }

  getCentres(): void {
    this.centreService.getAllCentres().subscribe(
      (response) => {
        this.centres = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des centres:', error);
      }
    );
  }

  getCentreName(centreId: number): string {
    const centre = this.centres.find(c => c.id === centreId);
    return centre ? centre.name : 'Unknown Centre';
  }
}
