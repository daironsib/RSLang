import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthorizationComponent, DictionaryComponent, GamesComponent, HomeComponent, LoginComponent, RegisterComponent, StatisticComponent } from './pages';

const PAGES = [
  HomeComponent,
  AuthorizationComponent,
  DictionaryComponent,
  GamesComponent,
  StatisticComponent,
  LoginComponent,
  RegisterComponent
]

@NgModule({
  declarations: [
    ...PAGES
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule
  ],
  exports: [
    ...PAGES
  ]
})
export class FeatureModule { }
