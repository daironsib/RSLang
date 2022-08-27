import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card'; 
import { AuthorizationComponent, DictionaryComponent, GamesComponent, HomeComponent, LoginComponent, RegisterComponent, StatisticComponent } from './pages';
import { CoreModule } from '@core/core.module';

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
    MatCardModule,
    CoreModule
  ],
  exports: [
    ...PAGES,
  ]
})
export class FeatureModule { }
