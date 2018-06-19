import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { Rank } from '../../services/interfaces/rank';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  ranklist: Rank[];
  fullRanklist: Rank[];
  counter: number;

  constructor(private auth: AuthService, private common: CommonService, private router: Router) { 
	this.counter = 100;
}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      console.log('Bottom', this.counter);
      this.loadUsers();
    }
  }

  ngOnInit() {
    if ( this.auth.authenticated() ) {
      // console.log('Authenticated');
    } else {
      this.router.navigate(['/']);
    }

    this.common.getRanklist()
    .subscribe( res => {
      this.fullRanklist = res;
      this.ranklist = this.fullRanklist.slice(0, 50);
      // console.log(this.ranklist);
    });
  }

  loadUsers() {
    for (let i = this.ranklist.length; i <= Math.min(this.counter, this.fullRanklist.length-1 ); i++) {
      this.ranklist.push(this.fullRanklist[i]);
    }
    this.counter += 50;
  }

}
