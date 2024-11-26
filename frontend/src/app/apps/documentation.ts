import { Component, OnInit, ViewChild } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { ReponseService } from '../service/reponse.service';
import { UserService } from '../service/user.service';
import { Question } from '../models/question';
import { Reponse } from '../models/reponse';
import { NgxCustomModalComponent } from 'ngx-custom-modal';

@Component({
    templateUrl: './documentation.html',
})
export class DocumentationComponent implements OnInit {
    searchQuery = '';
    questionsList: Question[] = [];
    filteredQuestionsList: Question[] = [];
    selectedQuestion: Question | null = null;
    responsesList: Reponse[] = [];
    userMap: { [key: number]: string } = {};
    questionsWithResponses: Set<number> = new Set(); // Track questions with responses

    @ViewChild('responsesModal') responsesModal!: NgxCustomModalComponent;

    constructor(
        private questionService: QuestionService,
        private reponseService: ReponseService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.loadQuestions();
    }

    loadQuestions() {
        this.questionService.getAllQuestions().subscribe(
            (questions: Question[]) => {
                this.questionsList = questions;
                this.questionsList.forEach(question => {
                    this.checkResponses(question);
                });
                this.searchQuestions();
            },
            error => {
                console.error('Error loading questions:', error);
            }
        );
    }

    searchQuestions() {
        this.filteredQuestionsList = this.questionsList.filter((question) =>
            question.titre.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }

    viewResponses(question: Question) {
        this.selectedQuestion = question;
        this.reponseService.getReponsesByQuestionId(question.id).subscribe(
            (responses: Reponse[]) => {
                this.responsesList = responses;
                this.loadUserDetails();
                this.responsesModal.open();
            },
            error => {
                console.error('Error loading responses:', error);
            }
        );
    }

    loadUserDetails() {
        if (this.responsesList) {
            const userIds = this.responsesList.map(response => response.userId);
            userIds.forEach(userId => {
                if (!this.userMap[userId]) {
                    this.userService.getUserById(userId).subscribe(
                        user => {
                            this.userMap[userId] = `${user.first_name} ${user.last_name}`;
                        },
                        error => {
                            console.error('Error loading user details:', error);
                        }
                    );
                }
            });
        } else {
            console.error('responsesList is null');
        }
    }

    checkResponses(question: Question) {
        this.reponseService.getReponsesByQuestionId(question.id).subscribe(
            (responses: Reponse[]) => {
                if (responses.length > 0) {
                    this.questionsWithResponses.add(question.id);
                }
            },
            error => {
                console.error('Error checking responses:', error);
            }
        );
    }

    hasResponses(question: Question): boolean {
        return this.questionsWithResponses.has(question.id);
    }

    toggleResponses(question: Question) {
        if (!question.showResponses) {
            this.reponseService.getReponsesByQuestionId(question.id).subscribe(
                (responses: Reponse[]) => {
                    const userIds = responses.map(response => response.userId);
                    const uniqueUserIds = Array.from(new Set(userIds));

                    uniqueUserIds.forEach(userId => {
                        if (!this.userMap[userId]) {
                            this.userService.getUserById(userId).subscribe(
                                user => {
                                    this.userMap[userId] = `${user.first_name} ${user.last_name}`;
                                    this.updateResponsesWithUserNames(question, responses);
                                },
                                error => {
                                    console.error('Error loading user details:', error);
                                }
                            );
                        } else {
                            this.updateResponsesWithUserNames(question, responses);
                        }
                    });
                },
                error => {
                    console.error('Error loading responses:', error);
                }
            );
        } else {
            question.showResponses = false; // Hide responses if already shown
        }
    }

    updateResponsesWithUserNames(question: Question, responses: Reponse[]) {
        question.responses = responses.map(response => ({
            ...response,
            userName: this.userMap[response.userId] || 'Utilisateur inconnu'
        }));
        question.showResponses = true; // Toggle the display
    }
}
