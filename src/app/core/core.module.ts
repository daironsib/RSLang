import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationPanelComponent } from './components/navigation-panel/navigation-panel.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { TokenStorageService } from './services/token-storage.service';
import { FooterComponent } from './components/footer/footer.component';
import { FooterService } from './services/footer.service';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    NavigationPanelComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    NavigationPanelComponent,
    FooterComponent,
    HeaderComponent
  ],
  providers: [
  	ApiService,
  	TokenStorageService,
    FooterService
  ]
})
export class CoreModule { }
