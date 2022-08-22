import { Component, OnInit } from '@angular/core';
import { FooterService } from '@core/services/footer.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  public footerState: boolean;

  constructor(public state: FooterService) {
    this.footerState = false;
  }

  ngOnInit(): void {
    this.state.setFooterState(this.footerState);
  }
}
