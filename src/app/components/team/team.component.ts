import { Component, OnInit } from '@angular/core';
import { SquadDetail } from '../../services/interfaces/squad';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  lineup: SquadDetail[];

  gk: SquadDetail[];
  def: SquadDetail[];
  mid: SquadDetail[];
  fwd: SquadDetail[];
  subs: SquadDetail[];


  constructor(private auth: AuthService, private apiService: ApiService, private router: Router ) {
    this.gk = [];
    this.def = [];
    this.mid = [];
    this.fwd = [];
    this.subs = [];
  }

  ngOnInit() {
    this.apiService.getLineup()
    .subscribe(res => {
      this.lineup = res;
      console.log(res);
      this.extract();
    });
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
