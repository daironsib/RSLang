import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationPanelComponent } from './components/navigation-panel/navigation-panel.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { TokenStorageService } from './services/token-storage.service';

@NgModule({
  declarations: [
    NavigationPanelComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    MatButtonModule
  ],
  exports: [
    NavigationPanelComponent
  ],
  providers: [
  	ApiService,
  	TokenStorageService
  ]
})
export class CoreModule { }
