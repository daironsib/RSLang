import { Component, OnInit } from '@angular/core';
import { IUserLS, Paths } from '@core/models';
import { TokenStorageService } from '@core/services/token-storage.service';

@Component({
  selector: 'app-navigation-panel',
  templateUrl: './navigation-panel.component.html',
  styleUrls: ['./navigation-panel.component.scss']
})
export class NavigationPanelComponent {
  public paths = Paths;
  public user: IUserLS;
  public gameMenu: boolean = false;
  public burgerMenu: boolean = false;

  constructor(public tokenStorageService: TokenStorageService) {
    this.user = this.tokenStorageService.getUser();
   }
}
