import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import Swal from 'sweetalert2';
import { QuestionService } from '../service/question.service';
import { Question } from '../models/question';
import { toggleAnimation } from '../shared/animations';
import { UserService } from '../service/user.service';
import { ReponseService } from '../service/reponse.service';
import { Reponse } from '../models/reponse';

@Component({
    templateUrl: './questionnaire.html',
    animations: [toggleAnimation],
})
export class QuestionnaireComponent implements OnInit {
    constructor(
        public fb: FormBuilder,
        private questionService: QuestionService,
        private userService: UserService,
        private reponseService: ReponseService
    ) {}

    @ViewChild('addQuestionModal') addQuestionModal!: NgxCustomModalComponent;
    @ViewChild('repondreModal') repondreModal!: NgxCustomModalComponent;
    params!: FormGroup;
    questionsList: Question[] = [];
    filteredQuestionsList: Question[] = [];
    searchQuery = '';
    reponseParams!: FormGroup;

    ngOnInit() {
        this.loadAllQuestions();
        this.initForm();
        this.initReponseForm();
    }

    displayType: string = 'list';
    loadAllQuestions() {
        this.questionService.getAllQuestions().subscribe(
            (questions: Question[]) => {
                this.questionsList = questions || [];
                this.searchQuestions();
            },
            error => {
                console.error('Error loading questions:', error);
                this.questionsList = [];
            }
        );
    }

    initForm() {
        this.params = this.fb.group({
            id: [0],
            titre: ['', Validators.required],
            contenu: ['', Validators.required],
            userId: [this.questionService.user.id],
        });
    }

    initReponseForm() {
        this.reponseParams = this.fb.group({
            contenu: ['', Validators.required],
            userId: [this.getCurrentUserId()],
            questionId: [0],
        });
    }

    searchQuestions() {
        this.filteredQuestionsList = this.questionsList.filter((q) =>
            q.titre.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }

    editQuestion(question: Question | null = null) {
        this.addQuestionModal.open();
        this.initForm();
        if (question) {
            this.params.setValue({
                id: question.id,
                titre: question.titre,
                contenu: question.contenu,
                dateCreation: question.dateCreation || new Date().toISOString(),
                userId: question.userId,
            });
        }
    }

    saveQuestion() {
        if (this.params.invalid) {
            this.showMessage('All fields are required.', 'error');
            return;
        }
        const questionData = this.params.value;

        if (!questionData.id) {
            questionData.dateCreation = new Date().toISOString();
        }

        if (questionData.id) {
            this.questionService.updateQuestion(questionData.id, questionData).subscribe(
                () => this.onQuestionSaved(),
                error => {
                    console.error('Error updating question:', error);
                    this.showMessage(`Failed to update question: ${error.message}`, 'error');
                }
            );
        } else {
            this.questionService.createQuestion(questionData).subscribe(
                () => this.onQuestionSaved(),
                error => {
                    console.error('Error creating question:', error);
                    this.showMessage(`Failed to create question: ${error.message}`, 'error');
                }
            );
        }
    }

    onQuestionSaved() {
        this.showMessage('Question has been saved successfully.');
        this.addQuestionModal.close();
        this.loadAllQuestions();
    }

    deleteQuestion(question: Question) {
        this.questionService.deleteQuestion(question.id).subscribe(
            () => {
                this.showMessage('Question has been deleted successfully.');
                this.loadAllQuestions();
            },
            error => console.error('Error deleting question:', error)
        );
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

    repondreQuestion(question: Question) {
        console.log('Répondre to question:', question);
    }

    getCurrentUserId(): number | null {
        return this.userService.getCurrentUserId();
    }

    openReponseModal(questionId: number) {
        this.reponseParams.patchValue({ questionId });
        this.repondreModal.open();
    }

    saveReponse() {
        if (this.reponseParams.invalid) {
            this.showMessage('Response content is required.', 'error');
            return;
        }
        const reponseData = {
            ...this.reponseParams.value,
            dateCreation: new Date().toISOString()
        };
        console.log('Sending response data:', reponseData);
        this.reponseService.createReponse(reponseData).subscribe(
            () => {
                this.showMessage('Response has been saved successfully.');
                this.repondreModal.close();
            },
            error => {
                console.error('Error saving response:', error);
                this.showMessage(`Failed to save response: ${error.message}`, 'error');
            }
        );
    }
}
