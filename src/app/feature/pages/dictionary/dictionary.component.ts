import { Component, OnInit } from '@angular/core';
import { FooterService } from '@core/services/footer.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit {
  public footerState: boolean;

  constructor(public state: FooterService) {
    this.footerState = true;
  }

  ngOnInit(): void {
    this.state.setFooterState(this.footerState);
  }
}
