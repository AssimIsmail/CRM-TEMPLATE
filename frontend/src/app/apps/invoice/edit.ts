import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/service/client.service';
import { Client } from '../../models/client';
import { ProjectService } from 'src/app/service/project.service';
import { UserService } from 'src/app/service/user.service';
import { StatusService } from 'src/app/service/status.service';
import { Project } from 'src/app/models/project';
import { Status } from 'src/app/models/status.model';
import { User } from 'src/app/models/user';

@Component({
    templateUrl: './edit.html',
})
export class InvoiceEditComponent implements OnInit {
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

    projects: Project[] = [];
    statuses: Status[] = [];
    prospecteurs: User[] = [];
    vendeurs: User[] = [];

    constructor(
        private clientService: ClientService,
        private userService: UserService,
        private projectService: ProjectService,
        private statusService: StatusService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        const clientId = this.route.snapshot.paramMap.get('id');
        if (clientId) {
            this.loadClient(parseInt(clientId, 10));
        }
        this.loadProjects();
        this.loadStatuses();
        this.loadUsersByRole();
    }

    loadClient(id: number) {
        this.clientService.getClientById(id).subscribe(
            (client: Client) => {
                this.client = client;
            },
            (error: any) => {
                console.error('Error loading client', error);
            }
        );
    }

    loadProjects() {
        this.projectService.getAllProjects().subscribe(
            (projects: Project[]) => {
                this.projects = projects;
            },
            (error: any) => {
                console.error('Error loading projects', error);
            }
        );
    }

    loadStatuses() {
        this.statusService.getAllStatuses().subscribe(
            (statuses: Status[]) => {
                this.statuses = statuses;
            },
            (error: any) => {
                console.error('Error loading statuses', error);
            }
        );
    }

    loadUsersByRole() {
        this.userService.getUsersByRole(['PROSPECTEUR']).subscribe(
            (prospecteurs: User[]) => {
                this.prospecteurs = prospecteurs;
            },
            (error: any) => {
                console.error('Error loading prospecteurs', error);
            }
        );

        this.userService.getUsersByRole(['VENDEUR']).subscribe(
            (vendeurs: User[]) => {
                this.vendeurs = vendeurs;
            },
            (error: any) => {
                console.error('Error loading vendeurs', error);
            }
        );
    }

    updateClient() {
        this.clientService.updateClient(this.client.id, this.client).subscribe(
            (updatedClient: Client) => {
                console.log('Client updated successfully', updatedClient);
                this.router.navigate(['/apps/offres']);
            },
            (error: any) => {
                console.error('Error updating client', error);
            }
        );
    }
}
