import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { AuthorizationComponent } from './pages/authorization/authorization.component';
import { DictionaryComponent } from './pages/dictionary/dictionary.component';
import { GamesComponent } from './pages/games/games.component';
import { StatisticComponent } from './pages/statistic/statistic.component';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card'; 

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
    CommonModule,
    MatButtonModule,
    MatCardModule
  ],
  exports: [
    ...PAGES
  ]
})
export class FeatureModule { }
