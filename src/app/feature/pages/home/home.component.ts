import { Component, OnInit } from '@angular/core';
import { FooterService } from '@core/services/footer.service';
import { Paths } from '@core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public footerState: boolean;
  public paths = Paths;

  constructor(public state: FooterService) {
    this.footerState = true;
  }

  ngOnInit(): void {
    this.state.setFooterState(this.footerState);
  }
}
