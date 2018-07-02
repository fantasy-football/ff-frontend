import { Component, OnInit } from '@angular/core';
import { SquadDetail } from '../../services/interfaces/squad';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lineup',
  templateUrl: './lineup.component.html',
  styleUrls: ['./lineup.component.css']
})
export class LineupComponent implements OnInit {

  
  lineup: SquadDetail[];

  gk: SquadDetail[];
  def: SquadDetail[];
  mid: SquadDetail[];
  fwd: SquadDetail[];
  subs: SquadDetail[];
  
  userId: string;

  constructor(private auth: AuthService, private apiService: ApiService, private router: Router, private route: ActivatedRoute ) {
    this.gk = [];
    this.def = [];
    this.mid = [];
    this.fwd = [];
    this.subs = [];

    this.route.params.subscribe( params => {
        this.userId = params['id'];
        this.getLineup(); }
    );
  }

  ngOnInit() {

 }
 
 getLineup() {
    const payload = {'id': this.userId};

    this.apiService.getOppLineup(payload)
    .subscribe(res => {
      this.lineup = res;
      //console.log(res);
      this.extract();
      },
      error => { this.router.navigate(['/leaderboard']); }
     );
    }
  

  extract() {
    for (let i = 0; i < 11; i++) {
      
      if (this.lineup[i].isCaptain) {
        this.lineup[i].name += ' (c)';
      }
      
      if (this.lineup[i].isVC) {
        this.lineup[i].name += ' (vc)';
      }
      
      if (this.lineup[i].position === 'GK') {
        this.gk.push(this.lineup[i]);
        console.log(this.lineup[i].isSub);
      } else if (this.lineup[i].position === 'DEF') {
        this.def.push(this.lineup[i]);
      } else if (this.lineup[i].position === 'MID') {
        this.mid.push(this.lineup[i]);
      } else if (this.lineup[i].position === 'FWD') {
        this.fwd.push(this.lineup[i]);
      }

    }

    for (let i = 11; i < 15; i++) {
      
      if (this.lineup[i].isCaptain) {
        this.lineup[i].name += ' (c)';
      }
      
      if (this.lineup[i].isVC) {
        this.lineup[i].name += ' (vc)';
      }
      
      this.subs.push(this.lineup[i]);
    }
  }

}
