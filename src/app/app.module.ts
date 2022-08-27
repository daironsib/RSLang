import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeatureModule } from '@feature/feature.module';
import { CoreModule } from '@core/core.module';
import { AudioPlayerService } from '@core/services/audio-player.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    FeatureModule,
  ],
  providers: [AudioPlayerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
