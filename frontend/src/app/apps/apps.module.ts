import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// shared module
import { SharedModule } from 'src/shared.module';

import { ScrumboardComponent } from './scrumboard';
import { ContactsComponent } from './contacts';
import { NotesComponent } from './notes';
import { TodolistComponent } from './todolist';
import { InvoicePreviewComponent } from './invoice/preview';
import { InvoiceAddComponent } from './invoice/add';
import { InvoiceEditComponent } from './invoice/edit';
import { CalendarComponent } from './calendar';
import { ChatComponent } from './chat';
import { MailboxComponent } from './mailbox';
import { InvoiceListComponent } from './invoice/list';
import { CentresComponent } from './centres';
import { ProjectsComponent } from './projets';
import { StatusComponent } from './status';
import { UsersComponent } from './users';
import { OffresComponent } from './offres';
import { DocumentationComponent } from './documentation';
import { QuestionnaireComponent } from './questionnaire';
import { CalendarautresComponent } from './calendarautres';

const routes: Routes = [
    { path: 'apps/chat', component: ChatComponent, data: { title: 'Discussion' } },
    { path: 'apps/mailbox', component: MailboxComponent, data: { title: 'Mailbox' } },
    { path: 'apps/scrumboard', component: ScrumboardComponent, data: { title: 'Scrumboard' } },
    { path: 'apps/contacts', component: ContactsComponent, data: { title: 'Contacts' } },
    { path: 'apps/centres', component: CentresComponent, data: { title: 'Centres' } },
    { path: 'apps/projects', component: ProjectsComponent, data: { title: 'Projects' } },
    { path: 'apps/status', component: StatusComponent, data: { title: 'Status' } },
    { path: 'apps/users', component: UsersComponent, data: { title: 'Users' } },
    { path: 'apps/offres', component: OffresComponent, data: { title: 'Offres' } },
    { path: 'apps/notes', component: NotesComponent, data: { title: 'Remarques' } },
    { path: 'apps/documentation', component: DocumentationComponent, data: { title: 'Documentation' } },
    { path: 'apps/questionnaire', component: QuestionnaireComponent, data: { title: 'Questionnaire' } },
    { path: 'apps/todolist', component: TodolistComponent, data: { title: 'Tache' } },
    { path: 'apps/invoice/list', component: InvoiceListComponent, data: { title: 'Invoice List' } },
    { path: 'apps/invoice/preview', component: InvoicePreviewComponent, data: { title: 'Observer offre' } },
    { path: 'apps/invoice/add', component: InvoiceAddComponent, data: { title: 'Ajouter Offre' } },
    { path: 'apps/invoice/edit/:id', component: InvoiceEditComponent, data: { title: 'Modifier Offre' } },
    { path: 'apps/calendar', component: CalendarComponent, data: { title: 'Calendar' } },
    { path: 'apps/calendarautres', component: CalendarautresComponent, data: { title: 'Calendarautres' } },
    { path: 'apps/invoice/preview/:id', component: InvoicePreviewComponent, data: { title: 'Invoice Preview' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, SharedModule.forRoot()],
    declarations: [
        ChatComponent,
        ScrumboardComponent,
        ContactsComponent,
        NotesComponent,
        TodolistComponent,
        InvoiceListComponent,
        InvoicePreviewComponent,
        InvoiceAddComponent,
        InvoiceEditComponent,
        CalendarComponent,
        MailboxComponent,
        CentresComponent,
        ProjectsComponent,
        StatusComponent,
        UsersComponent,
        OffresComponent,
        DocumentationComponent,
        QuestionnaireComponent,
        CalendarautresComponent
    ],
})
export class AppsModule { }
