import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Player } from '../../services/interfaces/player';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-squad',
  templateUrl: './squad.component.html',
  styleUrls: ['./squad.component.css']
})
export class SquadComponent implements OnInit {

  playerControl = new FormControl();

  players: Player[];
  filteredPlayers: Player[];

  def: Player[];
  mid: Player[];
  fwd: Player[];
  squad: Player[];
  gk: Player[];
  substitutes: Player[];

  captain: Player;
  viceCaptain: Player;

  subGk: number;
  subDef: number;
  subMid: number;
  subFwd: number;

  balance: number;
  teamCounter: number[];
  playerCount: number;

  squadLimitExceeded: boolean;
  validatedSquad: boolean;
  budgetExeeded: boolean;

  isMobileDevice: boolean;
  showSquadMenu: boolean;
  showPlayerMenu: boolean;
  createdSquad: boolean;

  disabledTeams: string[];

  filters = [
    {
      'name': 'Position',
      'options': [
        {'value': 'GK', 'view': 'Goalkeepers'},
        {'value': 'DEF', 'view': 'Defenders'},
        {'value': 'MID', 'view': 'Midfielders'},
        {'value': 'FWD', 'view': 'Forwards'},
      ]
    },
    {
      'name': 'Team',
      'options' : [
        {'value': 'ARG', 'view': 'Argentina'},
        {'value': 'ENG', 'view': 'England'},
        {'value': 'FRA', 'view': 'France'},
        {'value': 'MAR', 'view': 'Morocco'},
        {'value': 'ISL', 'view': 'Iceland'},
        {'value': 'CRC', 'view': 'Costa Rica'},
        {'value': 'ESP', 'view': 'Spain'},
        {'value': 'BRA', 'view': 'Brazil'},
        {'value': 'PER', 'view': 'Peru'},
        {'value': 'RUS', 'view': 'Russia'},
        {'value': 'AUS', 'view': 'Australia'},
        {'value': 'EGY', 'view': 'Egypt'},
        {'value': 'URU', 'view': 'Uruguay'},
        {'value': 'POR', 'view': 'Portugal'},
        {'value': 'IRN', 'view': 'Iran'},
        {'value': 'NGA', 'view': 'Nigeria'},
        {'value': 'SUI', 'view': 'Switzerland'},
        {'value': 'SRB', 'view': 'Serbia'},
        {'value': 'MEX', 'view': 'Mexico'},
        {'value': 'GER', 'view': 'Germany'},
        {'value': 'KSA', 'view': 'Saudi Arabia'},
        {'value': 'SWE', 'view': 'Sweden'},
        {'value': 'KOR', 'view': 'South Korea'},
        {'value': 'BEL', 'view': 'Belgium'},
        {'value': 'PAN', 'view': 'Panama'},
        {'value': 'TUN', 'view': 'Tunisia'},
        {'value': 'POL', 'view': 'Poland'},
        {'value': 'SEN', 'view': 'Senegal'},
        {'value': 'COL', 'view': 'Colombia'},
        {'value': 'JPN', 'view': 'Japan'}
      ]
    }
  ];

  constructor(
    private http: HttpClient, private apiService: ApiService, private commonService: CommonService, private router: Router
  ) {
    this.def = [];
    this.mid = [];
    this.fwd = [];
    this.gk = [];

    this.squad = [];
    this.substitutes = [];

    this.captain = null;
    this.viceCaptain = null;

    this.playerCount = 0;
    this.balance = 100;
    this.subGk = 0;
    this.subDef = 0;
    this.subMid = 0;
    this.subFwd = 0;

    this.validatedSquad = false;
    this.squadLimitExceeded = false;
    this.budgetExeeded = false;
    this.createdSquad = false;

    this.disabledTeams = ['KSA', 'RUS', 'EGY', 'URU', 'MAR', 'IRN'];

    this.teamCounter = new Array<number>(32).fill(0);

    this.checkMobileDevice();

   }

  ngOnInit() {
    this.commonService.getUserDetails()
    .subscribe(res => {
      if (res['flag']) {
        this.router.navigate(['/lineup']);
      }
    });

    this.apiService.getPlayers()
    .subscribe(res => {
      this.players = res;
      this.filteredPlayers = res;
      this.applyDisableFilter();
    });
  }

  applyDisableFilter(): void {
    for ( let i = 0; i < this.disabledTeams.length; i++) {
      this.players = this.players.filter(object => object.trigram !== this.disabledTeams[i]);
      this.filteredPlayers = this.filteredPlayers.filter(object => object.trigram !== this.disabledTeams[i]);
    }
  }

  checkMobileDevice(): void {
    if (window.innerWidth < 992) {
      this.isMobileDevice = true;
      this.showSquadMenu = true;
      this.showPlayerMenu = false;
    } else {
      this.isMobileDevice = false;
      this.showSquadMenu = true;
      this.showPlayerMenu = true;
    }

  }


  toggleMenu(position: string): void {
    if (this.isMobileDevice) {
      this.showPlayerMenu = !this.showPlayerMenu;
      this.showSquadMenu = !this.showSquadMenu;
    }

    if (position) {
      this.filterByPosition(position);
    }
  }

  applyFilter(option: string) {
    if (!option) {
      this.filteredPlayers = this.players;
    } else if (option === 'GK' || option === 'DEF' || option === 'MID' || option === 'FWD') {
      this.filterByPosition(option);
    } else {
      this.filterByTeam(option);
    }
  }


  addPlayer(player: Player) {
    if (this.balance >= player.value) {
      if ( this.teamCounter[player.teamId - 1] > 3 ) {
        // console.log('This should not happen, resetting squad');
        this.squad = [];
      } else if ( this.teamCounter[player.teamId - 1] === 3) {
        // console.log('Cant have more than 3 players from 1 team');
        this.squadLimitExceeded = true;
      } else {
        if (player.position === 'DEF') {
          if (this.def.length < 5) {
            this.def.push(player);
            this.squad.push(player);
            this.teamCounter[player.teamId - 1]++;
            this.playerCount++;
            this.balance -= player.value;
          } else {
            // console.log('Defender limit exceeded');
            this.squadLimitExceeded = true;
          }
        } else if (player.position === 'MID') {
          if (this.mid.length < 5) {
            this.mid.push(player);
            this.squad.push(player);
            this.teamCounter[player.teamId - 1]++;
            this.playerCount++;
            this.balance -= player.value;
          } else {
          // console.log('Midfielder limit exceeded');
          this.squadLimitExceeded = true;
          }
        } else if (player.position === 'FWD') {
          if (this.fwd.length < 3) {
            this.fwd.push(player);
            this.squad.push(player);
            this.teamCounter[player.teamId - 1]++;
            this.playerCount++;
            this.balance -= player.value;
          } else {
            // console.log('Forward limit exceeded');
            this.squadLimitExceeded = true;
          }
        } else if (player.position === 'GK') {
          if (this.gk.length < 2) {
            this.gk.push(player);
            this.squad.push(player);
            this.teamCounter[player.teamId - 1]++;
            this.playerCount++;
            this.balance -= player.value;
          } else {
            // console.log('Goalkeeper limit exceeded');
            this.squadLimitExceeded = true;
          }
        }
      }
    } else {
      // console.log('Budget Exceeded');
    }

    this.toggleMenu(null);

    if (this.squad.length === 15 && this.substitutes.length === 4 && this.captain && this.viceCaptain ) {
      if ( this.captain !== this.viceCaptain ) {
        this.validatedSquad = true;
      } else {
        this.validatedSquad = false;
      }
    }
  }

  addSubstitute(player: Player) {
    if (!this.playerInSub(player)) {
      if (this.playerInSquad(player)) {
        if (player.position === 'GK' && this.subGk === 0) {
          this.substitutes.push(player);
          this.subGk++;
        } else if ((this.substitutes.length - this.subGk) < 3 ) {
          if (player.position === 'DEF' && this.subDef < 2) {
            this.subDef++;
            this.substitutes.push(player);
          } else  if (player.position === 'MID' && this.subMid < 2) {
            this.subMid++;
            this.substitutes.push(player);
          } else  if (player.position === 'FWD' && this.subFwd < 2) {
            this.subFwd++;
            this.substitutes.push(player);
          } else {
            // console.log('Sub limit reached');
          }
        }
      } else {
        // console.log('Invalid action triggered');
      }

      if ( this.isMobileDevice ) {
        this.toggleMenu(null);
      }

      // console.log(player, this.substitutes.length);
      if ( this.substitutes.length === 4 && this.squad.length === 15 && this.captain && this.viceCaptain ) {
        if ( this.captain !== this.viceCaptain ) {
          this.validatedSquad = true;
        } else {
          this.validatedSquad = false;
        }
      }
    }
  }

  deleteSubstitute(player: Player) {
    if (this.playerInSub(player)) {
      this.substitutes = this.substitutes.filter(object => object !== player);

      if (player.position === 'GK') {
        this.subGk--;
      } else if (player.position === 'DEF') {
        this.subDef--;
      } else if (player.position === 'MID') {
        this.subMid--;
      } else if (player.position === 'FWD') {
        this.subFwd--;
      } else {
        // console.log('Invalid action triggered');
        this.resetSquad();
      }
    }
  }

  filterByPosition(position: string) {
    this.filteredPlayers = [];
    if (position === 'SUB') {
      if (this.squad.length !== 0) {
        this.filteredPlayers = this.squad;
      } else {
        this.filteredPlayers = this.players;
        this.toggleMenu(null);
      }
    } else {
      for ( let i = 0; i < this.players.length; i++  ) {
        if (this.players[i].position === position) {
          this.filteredPlayers.push(this.players[i]);
        }
      }
    }
  }

  filterByTeam(trigram: string) {
    this.filteredPlayers = [];
    for ( let i = 0; i < this.players.length; i++ ) {
      if (this.players[i].trigram === trigram) {
        this.filteredPlayers.push(this.players[i]);
      }
    }
  }

  resetSquad() {
    this.filteredPlayers = this.players;
    this.balance = 100;
    this.playerCount = 0;
    this.squad = [];
    this.def = [];
    this.mid = [];
    this.fwd = [];
    this.gk = [];
    this.substitutes = [];
    this.subDef = 0;
    this.subGk = 0;
    this.subMid = 0;
    this.subFwd = 0;
    this.teamCounter.fill(0);
    this.validatedSquad = false;
    this.squadLimitExceeded = false;
  }

  deletePlayer(player: Player) {
    const inSub = this.playerInSub(player);
    if (player.position === 'GK') {
      this.gk = this.gk.filter(object => object !== player );
      if (inSub) {
        this.subGk--;
      }
    } else if (player.position === 'DEF') {
      this.def = this.def.filter(object => object !== player );
      if (inSub) {
        this.subDef--;
      }
    } else if (player.position === 'MID' ) {
      this.mid = this.mid.filter(object => object !== player );
      if (inSub) {
        this.subMid--;
      }
    } else if (player.position === 'FWD' ) {
      this.fwd = this.fwd.filter(object => object !== player );
      if (inSub) {
        this.subFwd--;
      }
    } else {
      // console.log('Invalid action triggered');
      this.resetSquad();
      return;
    }

    this.squad = this.squad.filter(object => object !== player);
    this.substitutes = this.substitutes.filter(object => object !== player);

    this.playerCount--;
    this.teamCounter[player.teamId - 1]--;
    this.balance += player.value;

    if (this.validatedSquad) {
      this.validatedSquad = false;
    }
  }

  playerInSquad(player: Player): boolean {
    for ( let s = 0; s < this.squad.length; s++) {
      if ( this.squad[s] === player ) {
        return true;
      }
    }

    return false;
  }

  playerInSub(player: Player): boolean {
    for ( let s = 0; s < this.substitutes.length; s++) {
      if ( this.substitutes[s] === player ) {
        return true;
      }
    }

    return false;
  }

  setCaptain(player: Player) {
    this.captain = player;
    if ( this.substitutes.length === 4 && this.squad.length === 15 && this.captain && this.viceCaptain ) {
      if ( this.captain !== this.viceCaptain ) {
        this.validatedSquad = true;
      }
    }
  }

  setVC(player: Player) {
    this.viceCaptain = player;
    if ( this.substitutes.length === 4 && this.squad.length === 15 && this.captain && this.viceCaptain ) {
      if ( this.captain !== this.viceCaptain ) {
        this.validatedSquad = true;
      }
    }
  }

  submitSquad() {
    // console.log('Called submit Squad');
    const payload = {
      'squad': (this.squad),
      'subs': (this.substitutes),
      'captain': (this.captain),
      'vc': (this.viceCaptain)
    };

    this.apiService.submitSquad(payload).subscribe(res => {
      // console.log(res);
      this.router.navigate(['/lineup']);
    });
  }

}
