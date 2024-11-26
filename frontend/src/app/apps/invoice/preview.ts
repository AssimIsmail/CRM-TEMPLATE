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
    templateUrl: './preview.html',
})
export class InvoicePreviewComponent implements OnInit {
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

    getProjectName(projectId: number): string {
        const project = this.projects.find(p => p.id === projectId);
        return project ? project.name : 'N/A';
    }

    getStatusName(statusId: number): string {
        const status = this.statuses.find(s => s.id === statusId);
        return status ? status.name : 'N/A';
    }

    getUserName(userId: number): string {
        const user = this.prospecteurs.concat(this.vendeurs).find(u => u.id === userId);
        return user ? user.last_name : 'N/A';
    }

    goBack() {
        this.router.navigate(['/apps/offres']);
    }
}
