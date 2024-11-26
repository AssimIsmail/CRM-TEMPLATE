import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { toggleAnimation } from 'src/app/shared/animations';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoteService } from '../service/note.service';
import { UserService } from '../service/user.service';
import { Note } from '../models/note';
import { User } from '../models/user';
import { HttpErrorResponse } from '@angular/common/http';

interface NoteWithUserName extends Note {
    userName?: string;
}

@Component({
    templateUrl: './notes.html',
    animations: [toggleAnimation],
})
export class NotesComponent implements OnInit {
    constructor(
        public fb: FormBuilder,
        private noteService: NoteService,
        private userService: UserService,
        private cdr: ChangeDetectorRef
    ) {}

    @ViewChild('isAddNoteModal') isAddNoteModal!: NgxCustomModalComponent;
    @ViewChild('isDeleteNoteModal') isDeleteNoteModal!: NgxCustomModalComponent;
    @ViewChild('isViewNoteModal') isViewNoteModal!: NgxCustomModalComponent;
    params!: FormGroup;
    isShowNoteMenu = false;
    notesList: NoteWithUserName[] = [];
    filterdNotesList: NoteWithUserName[] = [];
    selectedTab: string = 'all';
    deletedNote: Note | null = null;
    selectedNote: Note = {
        id: 0,
        userId: this.noteService.user.id,
        title: '',
        description: '',
        date: '',
        isFav: false,
        tag: '',
    };

    ngOnInit() {
        this.loadUserNotes();
        this.initForm();
        this.cdr.detectChanges();
    }

    loadUserNotes() {
        this.noteService.getNotesByUserId(this.noteService.user.id).subscribe(
            (notes: Note[]) => {
                this.notesList = notes || [];
                this.mapUserNamesToNotes();
                this.searchNotes();
            },
            error => {
                console.error('Error loading notes:', error);
                this.notesList = [];
            }
        );
    }

    mapUserNamesToNotes() {
        const userIds = this.notesList.map(note => note.userId);
        this.userService.getAllUsers().subscribe((users: User[]) => {
            this.notesList.forEach(note => {
                const user = users.find(u => u.id === note.userId);
                if (user) {
                    note.userName = `${user.first_name} ${user.last_name}`;
                }
            });
        });
    }

    initForm() {
        this.params = this.fb.group({
            id: [0],
            title: ['', Validators.required],
            description: [''],
            tag: [''],
            userId: [this.noteService.user.id],
            date: [''],
            isFav: [false],
        });
    }

    searchNotes() {
        if (this.selectedTab === 'fav') {
            this.filterdNotesList = this.notesList.filter(note => note.isFav);
        } else if (this.selectedTab === 'all') {
            this.filterdNotesList = this.notesList;
        } else {
            this.filterdNotesList = this.notesList.filter(note => note.tag === this.selectedTab);
        }
        this.filterdNotesList = this.filterdNotesList || [];
    }

    saveNote() {
        if (this.params.controls['title'].errors) {
            this.showMessage('Title is required.', 'error');
            return;
        }
        const noteData = this.params.value;

        if (!noteData.id) {
            noteData.date = new Date().toISOString();
        }

        console.log('Note data being sent:', noteData);

        if (noteData.id) {
            console.log('Updating note with data:', noteData);
            this.noteService.updateNote(noteData.id, noteData).subscribe(
                () => this.onNoteSaved(),
                (error: HttpErrorResponse) => {
                    console.error('Error updating note:', error);
                    this.showMessage(`Failed to update note: ${error.message}`, 'error');
                }
            );
        } else {
            this.noteService.createNote(noteData).subscribe(
                () => this.onNoteSaved(),
                error => {
                    console.error('Error creating note:', error);
                    this.showMessage(`Failed to create note: ${error.message}`, 'error');
                }
            );
        }
    }

    onNoteSaved() {
        this.showMessage('Note has been saved successfully.');
        this.isAddNoteModal.close();
        this.loadUserNotes();
    }

    deleteNote() {
        if (this.deletedNote) {
            this.noteService.deleteNote(this.deletedNote.id).subscribe(
                () => {
                    this.showMessage('Note has been deleted successfully.');
                    this.isDeleteNoteModal.close();
                    this.loadUserNotes();
                },
                error => console.error('Error deleting note:', error)
            );
        }
    }

    tabChanged(type: string) {
        this.selectedTab = type;
        this.searchNotes();
        this.isShowNoteMenu = false;
    }

    setFav(note: any) {
        let item = this.filterdNotesList.find((d: { id: any }) => d.id === note.id);
        if (item) {
            item.isFav = !item.isFav;
            this.searchNotes();
        }
    }

    setTag(note: any, name: string = '') {
        let item = this.filterdNotesList.find((d: { id: any }) => d.id === note.id);
        if (item) {
            item.tag = name;
            this.searchNotes();
        }
    }

    deleteNoteConfirm(note: any) {
        setTimeout(() => {
            this.deletedNote = note;
            this.isDeleteNoteModal.open();
        });
    }

    viewNote(note: any) {
        setTimeout(() => {
            this.selectedNote = note;
            this.isViewNoteModal.open();
        });
    }

    editNote(note: any = null) {
        this.isShowNoteMenu = false;
        this.isAddNoteModal.open();
        this.initForm();
        if (note) {
            this.params.setValue({
                id: note.id,
                title: note.title,
                description: note.description,
                tag: note.tag,
                userId: note.userId,
                date: note.date || new Date().toISOString(),
                isFav: note.isFav || false,
            });
        }
    }
    getUserInitials(userId: string): string {
        if (!userId) return '';
        const names = userId.split(' ');
        return names.map(name => name[0]).join('').toUpperCase();
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
}
