import { Component, OnInit } from '@angular/core';
import { FooterService } from '@core/services/footer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public isShowFooter = true;

  constructor(public state: FooterService) {}

  ngOnInit(): void {
    this.state.footerState.subscribe((value) => (this.isShowFooter = value));
  }
}
