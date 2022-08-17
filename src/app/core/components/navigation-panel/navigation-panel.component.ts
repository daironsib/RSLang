import { Component, OnInit } from '@angular/core';
import { Paths } from '@core/models';

@Component({
  selector: 'app-navigation-panel',
  templateUrl: './navigation-panel.component.html',
  styleUrls: ['./navigation-panel.component.scss']
})
export class NavigationPanelComponent implements OnInit {
  public paths = Paths;

  constructor() { }

  ngOnInit(): void {
  }

}
