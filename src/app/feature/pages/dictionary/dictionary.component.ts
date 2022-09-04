import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { IUserWords, IWord } from '@core/models/api';
import { ApiService } from '@core/services/api.service';
import { FooterService } from '@core/services/footer.service';
import { TokenStorageService } from '@core/services/token-storage.service';
import { WordService } from '@core/services/word.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit {
  public footerState: boolean;
  public pageNo: number;
  public pageSize: number;
  public length: number;
  public currentGroupIndex: number;
  public words: IWord[] = [];
  public hardWords: IUserWords[] = [];
  
  constructor(public state: FooterService, public apiService: ApiService, public wordService: WordService, public tokenStorageService: TokenStorageService) {
    this.footerState = true;
    this.pageNo = 0;
    this.pageSize = 20;
    this.length = 600;
    this.currentGroupIndex = 0;
  }
 
  showGroup(group: number, page: number = 0) {
    this.pageNo = page;
    this.pageSize = 20;
    this.length = 600;
    this.currentGroupIndex = group;
    this.wordService.getAll(group, page).subscribe((value: IWord[]) => this.words = value);
  }
  
  showHardWords() {
    /* this.words = []; */
    this.wordService.getHardWords();
    this.words = this.wordService.hardWords;
    this.pageSize = this.words.length;
    this.length = this.words.length;
    /* .subscribe(
      data => {
        this.hardWords = data.filter(word => word.difficulty === 'hard');        
        this.hardWords.map(word => 
          this.apiService.getWordsID(word.wordId)
          .subscribe(data => {
            this.words.push(data)
            this.pageSize = this.words.length;
            this.length = this.words.length;
            })
          );
        }
    ); */
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
