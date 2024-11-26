import { Component, ViewChild } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import Swal from 'sweetalert2';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Store } from '@ngrx/store';
import { EventService } from '../service/event.service';
import { Event } from '../models/event';
import { UserService } from '../service/user.service';
import { User } from '../models/user';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    templateUrl: './calendarautres.html',
    animations: [toggleAnimation],
})
export class CalendarautresComponent {
    store: any;
    isLoading = true;
    @ViewChild('isAddEventModal') isAddEventModal!: NgxCustomModalComponent;
    @ViewChild('calendar') calendar!: FullCalendarComponent;
    defaultParams = {
        id: null,
        title: '',
        start: '',
        end: '',
        description: '',
        type: 'primary',
    };
    params!: FormGroup;
    minStartDate: any = '';
    minEndDate: any = '';

    events: Event[] = [];
    calendarOptions: any;
    users: User[] = [];
    selectedUserId: number | null = null;

    constructor(
        public fb: FormBuilder,
        public storeData: Store<any>,
        private eventService: EventService,
        private userService: UserService
    ) {
        this.initStore();
        this.isLoading = false;
        this.getUsers();
    }

    async initStore() {
        this.storeData
            .select((d: any) => d.index)
            .subscribe((d: any) => {
                const hasChangeLayout = this.store?.layout !== d?.layout;
                const hasChangeMenu = this.store?.menu !== d?.menu;
                const hasChangeSidebar = this.store?.sidebar !== d?.sidebar;

                this.store = d;

                if (hasChangeLayout || hasChangeMenu || hasChangeSidebar) {
                    if (this.isLoading) {
                        this.initCalendar();
                        this.calendarOptions.events = [];
                    } else {
                        setTimeout(() => {
                            this.initCalendar();
                        }, 300);
                    }
                }
            });
    }

    initCalendar() {
        this.calendarOptions = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
            },
            buttonText: {
                today: 'Aujourd\'hui',
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour',
            },
            editable: true,
            dayMaxEvents: true,
            selectable: true,
            droppable: true,
            eventClick: (event: any) => {
                this.editEvent(event);
            },
            select: (event: any) => {
                this.editDate(event);
            },
            locale: 'fr',
        };
    }

    ngOnInit() {
        this.initForm();
        this.getEvents();
    }

    initForm() {
        this.params = this.fb.group({
            id: null,
            title: ['', Validators.required],
            start: ['', Validators.required],
            end: ['', Validators.required],
            description: [''],
            type: ['primary'],
        });
    }

    getEvents() {
        this.eventService.getAllEvents().subscribe((events: Event[]) => {
            this.events = events.map(event => ({
                ...event,
                classNames: [event.type]
            }));
            this.calendarOptions.events = this.events;
        });
    }

    editEvent(data: any = null) {
        this.isAddEventModal.open();
        if (data) {
            let obj = JSON.parse(JSON.stringify(data.event));
            this.params.setValue({
                id: obj.id ? obj.id : null,
                title: obj.title ? obj.title : null,
                start: this.dateFormat(obj.start),
                end: this.dateFormat(obj.end),
                type: obj.classNames ? obj.classNames[0] : 'primary',
                description: obj.extendedProps ? obj.extendedProps.description : '',
            });
            this.minStartDate = new Date();
            this.minEndDate = this.dateFormat(obj.start);
        } else {
            this.params.reset(this.defaultParams);
            this.minStartDate = new Date();
            this.minEndDate = new Date();
        }
    }

    editDate(data: any) {
        let obj = {
            event: {
                start: data.start,
                end: data.end,
            },
        };
        this.editEvent(obj);
    }

    dateFormat(dt: any) {
        dt = new Date(dt);
        const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        const date = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
        const hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
        const mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
        dt = dt.getFullYear() + '-' + month + '-' + date + 'T' + hours + ':' + mins;
        return dt;
    }

    saveEvent() {
        if (!this.params.value.title || !this.params.value.start || !this.params.value.end || !this.selectedUserId) {
            return;
        }

        const eventData: Event = {
            id: this.params.value.id || 0,
            title: this.params.value.title,
            start: this.params.value.start,
            end: this.params.value.end,
            description: this.params.value.description,
            type: this.params.value.type,
            userId: this.selectedUserId
        };

        if (this.params.value.id) {
            this.eventService.updateEvent(this.params.value.id, eventData).subscribe(() => {
                this.showMessage('Event has been updated successfully.');
                if (this.selectedUserId !== null) {
                    this.getEventsByUserId(this.selectedUserId);
                }
                this.isAddEventModal.close();
            });
        } else {
            this.eventService.createEvent(eventData).subscribe(() => {
                this.showMessage('Event has been created successfully.');
                if (this.selectedUserId !== null) {
                    this.getEventsByUserId(this.selectedUserId);
                }
                this.isAddEventModal.close();
            });
        }
    }

    startDateChange(event: any) {
        const dateStr = event.target.value;
        if (dateStr) {
            this.minEndDate = this.dateFormat(dateStr);
            this.params.patchValue({ end: '' });
        }
    }

    showMessage(msg = '', type = 'success') {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    }

    deleteEvent() {
        if (this.params.value.id) {
            this.eventService.deleteEvent(this.params.value.id).subscribe(() => {
                this.showMessage('Event has been deleted successfully.');
                this.getEvents();
                this.isAddEventModal.close();
            });
        }
    }

    getUsers() {
        this.userService.getAllUsers().subscribe((users: User[]) => {
            this.users = users;
        });
    }

    onUserSelect(userId: number) {
        this.selectedUserId = userId;
        this.getEventsByUserId(userId);
    }

    getEventsByUserId(userId: number) {
        this.eventService.getEventsByUserId(userId).pipe(
            catchError(error => {
                console.error('Error fetching events for user:', error);
                return of([]); // Retourne un tableau vide en cas d'erreur
            })
        ).subscribe((events: Event[] | null) => {
            if (events && events.length > 0) { // Vérifiez si events n'est pas null et a des éléments
                this.events = events.map(event => ({
                    ...event,
                    classNames: [event.type]
                }));
                this.calendarOptions.events = this.events;

                // Force le calendrier à se mettre à jour
                this.calendar.getApi().refetchEvents();
                console.log('Events for selected user fetched:', this.events);
            } else {
                console.warn('No events found for the selected user.'); // Log si aucun événement n'est trouvé
                this.events = []; // Réinitialiser les événements si aucun n'est trouvé
                this.calendarOptions.events = []; // Réinitialiser les événements du calendrier
                this.calendar.getApi().refetchEvents(); // Forcer la mise à jour du calendrier
            }
        });
    }
}
