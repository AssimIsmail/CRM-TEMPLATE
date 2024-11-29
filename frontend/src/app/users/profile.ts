import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { CentreService } from '../service/centre.service';
import { User } from '../models/user';
import { Centre } from '../models/centre';
import { toggleAnimation } from 'src/app/shared/animations';

@Component({
    templateUrl: './profile.html',
    animations: [toggleAnimation],
})
export class ProfileComponent implements OnInit {
    currentUser: User | null = null;
    userCentre: Centre | null = null;

    constructor(private userService: UserService, private centreService: CentreService) {}

    ngOnInit() {
        this.loadCurrentUser();
    }

    loadCurrentUser() {
        const userId = this.userService.getCurrentUserId();
        if (userId !== null) {
            this.userService.getUserById(userId).subscribe(user => {
                this.currentUser = user;
                if (user.centreId) {
                    this.loadUserCentre(user.centreId);
                }
            });
        }
    }

    loadUserCentre(centreId: number) {
        this.centreService.getCentreById(centreId).subscribe(centre => {
            this.userCentre = centre;
        });
    }
}
