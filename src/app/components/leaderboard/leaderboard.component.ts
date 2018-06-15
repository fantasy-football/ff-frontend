import { Component, OnInit } from '@angular/core';
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
  constructor(private auth: AuthService, private common: CommonService, private router: Router) {
  }


  ngOnInit() {
    if ( this.auth.authenticated() ) {
      // console.log('Authenticated');
    } else {
      this.router.navigate(['/']);
    }

    this.common.getRanklist()
    .subscribe( res => {
      this.ranklist = res;
      // console.log(this.ranklist);
    });
  }

}
