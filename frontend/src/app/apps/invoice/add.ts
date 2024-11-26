import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/service/client.service';
import { UserService } from 'src/app/service/user.service';
import { ProjectService } from 'src/app/service/project.service';
import { StatusService } from 'src/app/service/status.service';
import { Client } from '../../models/client';
import { User } from 'src/app/models/user';
import { Project } from 'src/app/models/project';
import { Status } from 'src/app/models/status.model';

@Component({
  templateUrl: './add.html',
})
export class InvoiceAddComponent implements OnInit {
  client: Client = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    otherphone: '',
    address: '',
    commantaire_prospecteur: '',
    commantaire_vendeur: '',
    centreId: null,
    projectId: null,
    statusId: null,
    prospecteurId: null,
    vendeurId: null,
  };

  userRoles: string[] = [
    'SUPER_ADMIN',
    'ADMIN',
    'SOUS_ADMIN',
    'PARTENAIRE',
    'VENDEUR',
    'PROSPECTEUR',
    'USER'
  ];

  projects: Project[] = [];
  statuses: Status[] = [];
  prospecteurs: User[] = [];
  vendeurs: User[] = [];

  constructor(
    private clientService: ClientService,
    private userService: UserService,
    private projectService: ProjectService,
    private statusService: StatusService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsersByRole();
    this.loadProjects();
    this.loadStatuses();
  }

  loadUsersByRole() {
    this.userService.getUsersByRole(['PROSPECTEUR']).subscribe(
      (prospecteurs: User[]) => {
        this.prospecteurs = prospecteurs;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des prospecteurs', error);
      }
    );

    this.userService.getUsersByRole(['VENDEUR']).subscribe(
      (vendeurs: User[]) => {
        this.vendeurs = vendeurs;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des vendeurs', error);
      }
    );
  }

  loadProjects() {
    this.projectService.getAllProjects().subscribe(
      (projects: Project[]) => {
        this.projects = projects;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des projets', error);
      }
    );
  }

  loadStatuses() {
    this.statusService.getAllStatuses().subscribe(
      (statuses: Status[]) => {
        this.statuses = statuses;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des statuts', error);
      }
    );
  }

  // Méthode pour ajouter un client
  addClient() {
    this.clientService.createClient(this.client).subscribe(
      (createdClient: Client) => {
        console.log('Client ajouté avec succès', createdClient);
        this.router.navigate(['/apps/offres']);
      },
      (error: any) => {
        console.error('Erreur lors de l\'ajout du client', error);
        // Gérez les erreurs de manière appropriée (afficher un message, etc.)
      }
    );
  }
}
