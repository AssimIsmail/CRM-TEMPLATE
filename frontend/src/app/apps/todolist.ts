import { Component, ViewChild, OnInit } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import Swal from 'sweetalert2';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TacheService } from '../service/tache.service';
import { Tache } from '../models/tache';
import { UserService } from '../service/user.service';
import { User } from '../models/user';

@Component({
    templateUrl: './todolist.html',
    animations: [toggleAnimation],
})
export class TodolistComponent implements OnInit {
    constructor(private fb: FormBuilder, private tacheService: TacheService, private userService: UserService) {}

    @ViewChild('addTaskModal') addTaskModal!: NgxCustomModalComponent;
    @ViewChild('viewTaskModal') viewTaskModal!: NgxCustomModalComponent;

    defaultParams: Tache = {
        id: 0,
        title: '',
        description: '',
        date: '',
        priority: 'low',
        status: '',
        userId: 0,
        tag: '',
        path: '',
        assignee: '',
    };

    selectedTab = '';
    isShowTaskMenu = false;
    params!: FormGroup;
    allTasks: Tache[] = [];
    filteredTasks: Tache[] = [];
    pagedTasks: Tache[] = [];
    searchTask = '';
    selectedTask: Tache = this.defaultParams;
    isPriorityMenu: any = null;
    isTagMenu: any = null;

    pager = {
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
        startIndex: 0,
        endIndex: 0,
    };

    editorOptions = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'link'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean']
        ],
    };

    private debounceTimer: any;

    users: User[] = [];

    ngOnInit() {
        this.initForm();
        this.loadTasks();
        this.loadUsers();
    }

    initForm() {
        this.params = this.fb.group({
            id: [null],
            title: ['', Validators.required],
            description: [''],
            date: [new Date().toISOString().split('T')[0]], // Default to today's date
            priority: ['low'],
            status: [''],
            userId: [null], // Add this field for userId
            tag: [''],
            path: [''],
            assignee: [''],
        });
    }

    loadTasks() {
        this.tacheService.getAllTaches().subscribe(
            (tasks: Tache[]) => {
                this.allTasks = tasks;
                this.searchTasks();
            },
            error => {
                this.showMessage('Failed to load tasks.', 'error');
                console.error('Error loading tasks:', error);
            }
        );
    }

    searchTasks(isResetPage = true) {
        if (isResetPage) {
            this.pager.currentPage = 1;
        }

        let res: Tache[];

        if (this.selectedTab === 'complete' || this.selectedTab === 'important' || this.selectedTab === 'trash') {
            res = this.allTasks.filter(d => d.status === this.selectedTab);
        } else {
            res = this.allTasks.filter(d => d.status !== 'trash');
        }

        if (this.selectedTab === 'team' || this.selectedTab === 'update') {
            res = res.filter(d => d.tag === this.selectedTab);
        } else if (['high', 'medium', 'low'].includes(this.selectedTab)) {
            res = res.filter(d => d.priority === this.selectedTab);
        }

        this.filteredTasks = res.filter(d => d.title?.toLowerCase().includes(this.searchTask.toLowerCase()));
        this.getPager();
    }

    getPager() {
        setTimeout(() => {
            if (this.filteredTasks.length) {
                this.pager.totalPages = this.pager.pageSize < 1 ? 1 : Math.ceil(this.filteredTasks.length / this.pager.pageSize);
                if (this.pager.currentPage > this.pager.totalPages) {
                    this.pager.currentPage = 1;
                }
                this.pager.startIndex = (this.pager.currentPage - 1) * this.pager.pageSize;
                this.pager.endIndex = Math.min(this.pager.startIndex + this.pager.pageSize - 1, this.filteredTasks.length - 1);
                this.pagedTasks = this.filteredTasks.slice(this.pager.startIndex, this.pager.endIndex + 1);
            } else {
                this.pagedTasks = [];
                this.pager.startIndex = -1;
                this.pager.endIndex = -1;
            }
        });
    }

    setPriority(task: Tache, name: string = '') {
        let item = this.filteredTasks.find((d: { id: any }) => d.id === task.id);
        if (item) {
            item.priority = name;
            this.updateTask(item);
        }
    }

    setTag(task: Tache, name: string = '') {
        let item = this.filteredTasks.find((d: { id: any }) => d.id === task.id);
        if (item) {
            item.tag = name;
            this.updateTask(item);
        }
    }

    tabChanged(type: any = null) {
        this.selectedTab = type;
        this.searchTasks();
        this.isShowTaskMenu = false;
    }

    taskComplete(task?: Tache) {
        if (!task) return;
        let item = this.filteredTasks.find((d: { id: any }) => d.id === task.id);
        if (item) {
            item.status = item.status === 'complete' ? '' : 'complete';
            this.updateTask(item);
        }
    }

    setImportant(task: Tache | null = null) {
        if (!task) return;
        let item = this.filteredTasks.find((d: { id: any }) => d.id === task.id);
        if (item) {
            item.status = item.status === 'important' ? '' : 'important';
            this.updateTask(item);
        }
    }

    viewTask(item: Tache | null = null) {
        this.selectedTask = item || this.defaultParams;
        setTimeout(() => {
            this.viewTaskModal.open();
        });
    }

    addEditTask(task: Tache | null = null) {
        this.isShowTaskMenu = false;
        this.addTaskModal.open();
        this.initForm();

        if (task) {
            this.params.setValue({
                id: task.id,
                title: task.title,
                description: task.description,
                date: task.date,
                priority: task.priority,
                status: task.status,
                userId: task.userId || 0,
                tag: task.tag,
                path: task.path,
                assignee: task.assignee,
            });
        }
    }

    deleteTask(task: Tache, type: string = '') {
        if (type === 'delete') {
            this.tacheService.deleteTache(task.id).subscribe(() => {
                this.loadTasks();
                this.showMessage('Task moved to trash.', 'success');
            });
        }
        if (type === 'deletePermanent') {
            this.tacheService.deleteTache(task.id).subscribe(() => {
                this.loadTasks();
                this.showMessage('Task deleted permanently.', 'success');
            });
        }
        if (type === 'restore') {
            let currtask = this.allTasks.find((d: any) => d.id === task.id);
            if (currtask) {
                currtask.status = '';
                this.updateTask(currtask);
            }
        }
    }

    saveTask() {
        const userId = this.userService.getCurrentUserId();
        if (!this.params.value.title || !userId) {
            this.showMessage('Title and User are required.', 'error');
            return;
        }

        const taskData = { ...this.params.value, userId };

        if (taskData.id) {
            // Update task
            this.tacheService.updateTache(taskData.id, taskData).subscribe(
                () => {
                    this.loadTasks();
                    this.showMessage('Task has been updated successfully.');
                    this.addTaskModal.close();
                },
                error => {
                    console.error('Error updating task:', error);
                    this.showMessage('Failed to update task.', 'error');
                }
            );
        } else {
            // Add task
            this.tacheService.createTache(taskData).subscribe(
                (newTask: Tache) => {
                    this.allTasks.unshift(newTask);
                    this.loadTasks();
                    this.showMessage('Task has been saved successfully.');
                    this.addTaskModal.close();
                },
                error => {
                    console.error('Error creating task:', error);
                    this.showMessage('Failed to save task.', 'error');
                }
            );
        }
    }

    updateTask(task: Tache) {
        this.tacheService.updateTache(task.id, task).subscribe(() => {
            this.loadTasks();
        });
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

    setDescriptionText(event: any) {
        const currentDescription = this.params.get('description')?.value;
        if (currentDescription !== event.html) {
            this.params.patchValue({ description: event.html });
        }
    }

    getSelectedPriorityStyle(name: string) {
        return this.selectedTask.priority === name ? 'active' : '';
    }

    getSelectedTagStyle(name: string) {
        return this.selectedTask.tag === name ? 'active' : '';
    }

    getTasksLength(status: string): number {
        // Implement the logic to return the count of tasks based on the status
        return this.allTasks.filter(task => task.status === status).length;
    }

    loadUsers() {
        this.userService.getAllUsers().subscribe(users => {
            this.users = users;
        });
    }

    moveToTrash(task: Tache) {
        this.tacheService.moveToTrash(task.id).subscribe(() => {
            this.loadTasks(); // Reload tasks after moving to trash
            this.showMessage('Task moved to trash successfully.');
        }, error => {
            console.error('Error moving task to trash:', error);
            this.showMessage('Failed to move task to trash.', 'error');
        });
    }

    deleteTaskPermanently(task: Tache) {
        this.tacheService.deleteTaskPermanently(task.id).subscribe(() => {
            this.loadTasks(); // Reload tasks after deletion
            this.showMessage('Task deleted permanently.');
        }, error => {
            console.error('Error deleting task permanently:', error);
            this.showMessage('Failed to delete task permanently.', 'error');
        });
    }

    getPriorityInFrench(priority: string): string {
        const priorityMapping: { [key: string]: string } = {
            low: 'Faible',
            medium: 'Moyen',
            high: 'Élevé',
        };
        return priorityMapping[priority] || priority; // Return the French equivalent or the original if not found
    }

    getTagInFrench(tag: string): string {
        const tagMapping: { [key: string]: string } = {
            team: 'Équipe',
            update: 'Mise à jour',
        };
        return tagMapping[tag] || tag; // Return the French equivalent or the original if not found
    }
}
