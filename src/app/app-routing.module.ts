import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Paths } from '@core/models';
import { AuthorizationComponent, DictionaryComponent, SprintGameComponent, HomeComponent, StatisticComponent, LoginComponent, RegisterComponent, AudioGameComponent } from '@feature/pages';

const routes: Routes = [
  {path: Paths.Home, component: HomeComponent},
  {path: Paths.Authorization, component: AuthorizationComponent},
  {path: Paths.Dictionary, component: DictionaryComponent},
  {path: Paths.SprintGame, component: SprintGameComponent},
  {path: Paths.Statistic, component: StatisticComponent},
  {path: Paths.Login, component: LoginComponent},
  {path: Paths.Register, component: RegisterComponent},
  {path: Paths.AudioGame, component: AudioGameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
