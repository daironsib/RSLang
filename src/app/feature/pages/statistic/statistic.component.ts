import { Component, OnInit } from '@angular/core';
import { FooterService } from '@core/services/footer.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent implements OnInit {
  public footerState: boolean;

  constructor(public state: FooterService) {
    this.footerState = true;
  }

  ngOnInit(): void {
    this.state.setFooterState(this.footerState);
  }
}
