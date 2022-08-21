import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Paths } from '@core/models';
import { AuthorizationComponent, DictionaryComponent, GamesComponent, HomeComponent, StatisticComponent, LoginComponent, RegisterComponent } from '@feature/pages';

const routes: Routes = [
  {path: Paths.Home, component: HomeComponent},
  {path: Paths.Authorization, component: AuthorizationComponent},
  {path: Paths.Dictionary, component: DictionaryComponent},
  {path: Paths.Games, component: GamesComponent},
  {path: Paths.Statistic, component: StatisticComponent},
  {path: Paths.Login, component: LoginComponent},
  {path: Paths.Register, component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
