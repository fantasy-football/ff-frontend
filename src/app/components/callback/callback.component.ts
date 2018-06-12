import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit, OnDestroy {
  loggedInSub: Subscription;
  constructor(private auth: AuthService, private router: Router) {
      auth.handleLoginCallback();
   }


  ngOnInit() {
    this.loggedInSub = this.auth.loggedIn$.subscribe(
      loggedIn => loggedIn ? this.router.navigate(['/profile']) : null
    );
  }

  ngOnDestroy() {
    this.loggedInSub.unsubscribe();
  }

}
