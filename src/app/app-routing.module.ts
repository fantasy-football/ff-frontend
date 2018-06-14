import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { SquadComponent } from './components/squad/squad.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { CallbackComponent } from './components/callback/callback.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TeamComponent } from './components/team/team.component';
import { RulesComponent } from './components/rules/rules.component';

import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {path: '', component: AboutComponent, pathMatch: 'full' },
  {path: 'selection', component: SquadComponent, canActivate: [ AuthGuard ]},
  {path: 'leaderboard', component: LeaderboardComponent, canActivate: [ AuthGuard ] },
  {path: 'callback', component: CallbackComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [ AuthGuard ] },
  {path: 'lineup', component: TeamComponent, canActivate: [ AuthGuard ] },
  {path: 'rules', component: RulesComponent},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
