import { Component, OnInit } from '@angular/core';
import { IWord } from '@core/models/api';
import { Paths } from '@core/models/consts';
import { ApiService } from '@core/services/api.service';
import { FooterService } from '@core/services/footer.service';
import { SvgService } from '@core/services/svg.service';
import { TokenStorageService } from '@core/services/token-storage.service';
import { WordService } from '@core/services/word.service';

const LAST_PAGE = 'last-page';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss'],
})
export class DictionaryComponent implements OnInit {
  public footerState: boolean;
  public isHardWordsPage: boolean = false;
  public pageNo: number;
  public currentGroupIndex: number;
  public words: IWord[] = [];
  public paths = Paths;
  public folderColors = ['9B51E0','ff6781','00bfff','ccff00','51D9A8','FC8A4D'];
  public totalSections = [...Array(6).keys()];
  public totalPages = [...Array(20).keys()];
  public sectionMenu: boolean = false;
  public sectionMenuFooter: boolean = false;
  public gameMenu: boolean = false;
  public gameMenuFooter: boolean = false;
  public pagesMenu: boolean = false;
  public pagesMenuFooter: boolean = false;

  constructor(
    public state: FooterService,
    public apiService: ApiService,
    public wordService: WordService,
    public tokenStorageService: TokenStorageService,
    public svgService: SvgService,
  ) {
    this.footerState = true;
    this.pageNo = 0;
    this.currentGroupIndex = 0;
  }

  public showGroup(group: number, page: number = 0) {
    this.isHardWordsPage = false;
    window.localStorage.setItem(LAST_PAGE, JSON.stringify({ group, page }));
    this.pageNo = page;
    this.currentGroupIndex = group;
    this.wordService.getLearnedWords();
    this.wordService.getHardWords();
    this.wordService.getAll(group, page).subscribe((value: IWord[]) => {
      this.words = value;
    });
  }

  public showHardWords() {
    this.isHardWordsPage = true;
    window.localStorage.setItem(LAST_PAGE, JSON.stringify('hard'));
    this.words = this.wordService.getHardWords();
  }

  public nextPage() {
    this.pageNo < 19 ? (this.pageNo += 1) : this.pageNo;
    this.showGroup(this.currentGroupIndex, this.pageNo);
  }

  public prevPage() {
    this.pageNo > 0 ? (this.pageNo -= 1) : this.pageNo;
    this.showGroup(this.currentGroupIndex, this.pageNo);
  }

  ngOnInit(): void {
    this.state.setFooterState(this.footerState);
    const page = window.localStorage.getItem(LAST_PAGE);
    if (page) {
      const value = JSON.parse(page);
      value === 'hard'
        ? this.showHardWords()
        : this.showGroup(value.group, value.page);
    } else {
      this.showGroup(0, 0);
    }
  }
}
