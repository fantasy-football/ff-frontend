import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { SquadComponent } from './components/squad/squad.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { CallbackComponent } from './components/callback/callback.component';
import { ProfileComponent } from './components/profile/profile.component';

import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {path: '', component: AboutComponent, pathMatch: 'full' },
  {path: 'squad', component: SquadComponent, },
  {path: 'leaderboard', component: LeaderboardComponent, },
  {path: 'callback', component: CallbackComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [ AuthGuard ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
