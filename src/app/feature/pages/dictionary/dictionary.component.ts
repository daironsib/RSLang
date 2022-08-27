import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { IWord } from '@core/models/api';
import { ApiService } from '@core/services/api.service';
import { FooterService } from '@core/services/footer.service';
import { WordService } from '@core/services/word.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit {
  public footerState: boolean;
  public pageNo: number;
  public currentGroupIndex: number;
  public words: IWord[] = [];

  constructor(public state: FooterService, public apiService: ApiService, public wordService: WordService) {
    this.footerState = true;
    this.pageNo = 0;
    this.currentGroupIndex = 0;
  }
 
  showGroup(group: number, page: number = 0) {
    this.pageNo = page;
    this.currentGroupIndex = group;
    this.wordService.getAll(group, page).subscribe((value: IWord[]) => (this.words = value));
  }
  
  getPage(event: PageEvent) {
    if(event.pageIndex > this.pageNo) {
      this.pageNo += 1;
    } else {
      this.pageNo > 2 
      ? this.pageNo -= 1 
      : this.pageNo = 1
    }
    this.showGroup(this.currentGroupIndex, this.pageNo);
 }
  
  ngOnInit(): void {
    this.state.setFooterState(this.footerState);
    this.showGroup(0,0);
  }
}
