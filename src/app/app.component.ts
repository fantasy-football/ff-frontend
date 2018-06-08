import { Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  isCollapsed: boolean;
  title = 'app';

  constructor() {
    this.isCollapsed = true;
  }

  toggleState() {
    this.isCollapsed = !this.isCollapsed;
  }
}
