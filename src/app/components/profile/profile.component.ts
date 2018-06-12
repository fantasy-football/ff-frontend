import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { User } from '../../services/interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User;
  constructor(private auth: AuthService, private route: Router, private common: CommonService) { }

  ngOnInit() {
    if ( this.auth.authenticated() ) {
      console.log('Authenticated');
    } else {
      console.log('Not authenticated');
    }

    this.common.getUserDetails()
    .subscribe(res => {
      this.user = res;
      console.log(this.user);
    });
  }

  ngOnDestroy() {

  }
}
