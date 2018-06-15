import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { SquadComponent } from './components/squad/squad.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { CallbackComponent } from './components/callback/callback.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TeamComponent } from './components/team/team.component';
import { RulesComponent } from './components/rules/rules.component';
import { Error404Component } from './components/error404/error404.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { FixturesComponent } from './components/fixtures/fixtures.component';

import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {path: '', component: AboutComponent, pathMatch: 'full' },
  {path: 'selection', component: SquadComponent},
  {path: 'leaderboard', component: LeaderboardComponent, canActivate: [ AuthGuard ] },
  {path: 'callback', component: CallbackComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [ AuthGuard ] },
  {path: 'lineup', component: TeamComponent, canActivate: [ AuthGuard ] },
  {path: 'rules', component: RulesComponent},
  {path: 'fixtures', component: FixturesComponent},

  /*
  {path: 'selection', redirectTo: '/maintenance'},
  {path: 'leaderboard', redirectTo: '/maintenance'},
  {path: 'callback', redirectTo: '/maintenance'},
  {path: 'profile', redirectTo: '/maintenance'},
  {path: 'lineup', redirectTo: '/maintenance'},
  {path: 'rules', redirectTo: '/maintenance'},
  {path: 'fixtures', redirectTo: '/maintenance'},
  {path: 'maintenance', component: MaintenanceComponent},
  */

  {path: '**', component: Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
