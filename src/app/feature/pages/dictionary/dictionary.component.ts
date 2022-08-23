import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { IWord } from '@core/models/word';
import { ApiService } from '@core/services/api.service';
import { FooterService } from '@core/services/footer.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit {
  public footerState: boolean;
  public pageNo: number;
  public words: IWord[];
  public currentGroupIndex: string;

  constructor(public state: FooterService, public apiService: ApiService) {
    this.footerState = true;
    this.pageNo = 0;
    this.words = [];
    this.currentGroupIndex = '0';
  }
 
  showGroup(group: string, page: string = '0') {
    this.pageNo = +page;
    this.currentGroupIndex = group;
    const words: Observable<IWord[]> = this.apiService.getWords(group, page);
    words.subscribe((value) => (this.words = value));
  console.log(this.words);
  }
  
  getPage(event: PageEvent) {
    if(event.pageIndex > this.pageNo) {
      this.pageNo += 1;
    } else {
      this.pageNo > 2 
      ? this.pageNo -= 1 
      : this.pageNo = 1
    }
    this.showGroup(this.currentGroupIndex, this.pageNo.toString());
 }
  
  ngOnInit(): void {
    this.state.setFooterState(this.footerState);
  }
}
