import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationPanelComponent } from '@core/components/navigation-panel/navigation-panel.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '@core/services/api.service';
import { TokenStorageService } from '@core/services/token-storage.service';
import { FooterComponent } from '@core/components/footer/footer.component';
import { FooterService } from '@core/services/footer.service';
import { HeaderComponent } from '@core/components/header/header.component';
import { WordComponent } from '@core/components/word/word.component';
import { AudioGameItemComponent } from '@core/components/audio-game-item/audio-game-item.component';

@NgModule({
  declarations: [
    NavigationPanelComponent,
    FooterComponent,
    HeaderComponent,
    WordComponent,
    AudioGameItemComponent
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
    HeaderComponent,
    WordComponent,
    AudioGameItemComponent
  ],
  providers: [
  	ApiService,
  	TokenStorageService,
    FooterService
  ]
})
export class CoreModule { }
