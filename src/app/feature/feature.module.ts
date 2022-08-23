import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuthorizationComponent, DictionaryComponent, GamesComponent, HomeComponent, LoginComponent, RegisterComponent, StatisticComponent } from './pages';
import { WordComponent } from '../word/word.component';

const PAGES = [
  HomeComponent,
  AuthorizationComponent,
  DictionaryComponent,
  GamesComponent,
  StatisticComponent,
  LoginComponent,
  RegisterComponent,
]

@NgModule({
  declarations: [
    ...PAGES,
    WordComponent
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
    MatPaginatorModule
  ],
  exports: [
    ...PAGES,
    WordComponent
  ]
})
export class FeatureModule { }
