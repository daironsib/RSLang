import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card'; 
import { AudioGameComponent, AuthorizationComponent, DictionaryComponent, SprintGameComponent, HomeComponent, LoginComponent, RegisterComponent, StatisticComponent } from './pages';
import { WordComponent } from './components/word/word.component';
import { AudioGameItemComponent } from './components/audio-game-item/audio-game-item.component';

const PAGES = [
  HomeComponent,
  AuthorizationComponent,
  DictionaryComponent,
  SprintGameComponent,
  StatisticComponent,
  LoginComponent,
  RegisterComponent,
  AudioGameComponent
]

@NgModule({
  declarations: [
    ...PAGES,
    WordComponent,
    AudioGameItemComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    RouterModule.forChild([]), 
    FormsModule,
    RouterModule,
    MatTabsModule,
    MatPaginatorModule,
    MatCardModule
  ],
  exports: [
    ...PAGES
  ]
})
export class FeatureModule { }
