import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Paths } from '@core/models';
import { AuthorizationComponent, DictionaryComponent, GamesComponent, HomeComponent, StatisticComponent } from '@feature/pages';

const routes: Routes = [
  {path: Paths.Home, component: HomeComponent},
  {path: Paths.Authorization, component: AuthorizationComponent},
  {path: Paths.Dictionary, component: DictionaryComponent},
  {path: Paths.Games, component: GamesComponent},
  {path: Paths.Statistic, component: StatisticComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
