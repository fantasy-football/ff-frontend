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
  constructor(private auth: AuthService, private router: Router) {
      auth.handleLoginCallback();
   }


  ngOnInit() {

  }

  ngOnDestroy() {
  }

}
