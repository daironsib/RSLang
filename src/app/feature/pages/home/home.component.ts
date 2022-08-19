import { Component, OnInit } from '@angular/core';
import { FooterService } from '@core/services/footer.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public footerState: boolean;

  constructor(public state: FooterService) {
    this.footerState = true;
  }

  ngOnInit(): void {
    this.state.setFooterState(this.footerState);
  }
}
