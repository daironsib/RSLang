import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { AuthorizationComponent } from './pages/authorization/authorization.component';
import { DictionaryComponent } from './pages/dictionary/dictionary.component';
import { GamesComponent } from './pages/games/games.component';
import { StatisticComponent } from './pages/statistic/statistic.component';

const PAGES = [
  HomeComponent,
  AuthorizationComponent,
  DictionaryComponent,
  GamesComponent,
  StatisticComponent
]

@NgModule({
  declarations: [
    ...PAGES
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ...PAGES
  ]
})
export class FeatureModule { }
