import { Component, OnInit } from '@angular/core';
import { IOptionStatistics, IStatistics, IWordStatistics, Paths } from '@core/models';
import { ApiService } from '@core/services/api.service';
import { FooterService } from '@core/services/footer.service';
import { TokenStorageService } from '@core/services/token-storage.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent implements OnInit {
  public footerState: boolean;
  public paths = Paths;
  public statisticData: IOptionStatistics = {};
  public currentDate = `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`;
  public wordStatistic: IWordStatistics = {
    [this.currentDate]: {
      newWords: 0,
      learnedWords: 0,
      correctAnswers: 0,
      wrongAnswers: 0
    }
  };

  constructor(
    public state: FooterService,
    public tokenStorage: TokenStorageService,
    private api: ApiService
  ) {
    this.footerState = true;
  }

  private getStatistic() {
    if (this.tokenStorage.getUser().id) {
      this.api.getStatistics(this.tokenStorage.getUser().id).subscribe(
        (data: IStatistics) => {
          const optional: IOptionStatistics = {
            audio: data.optional.audio,
            sprint: data.optional.sprint,
            wordsStatistics: data.optional.wordsStatistics,
          };
          if(data.optional.wordsStatistics) {
            this.wordStatistic = data.optional.wordsStatistics;
          }
          this.statisticData = optional;
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }
  
  public getPercentSprint() {
    if(this.statisticData.sprint){
      return ((this.statisticData.sprint.correctAnswers /  (this.statisticData.sprint.correctAnswers +  this.statisticData.sprint.wrongAnswers)) * 100).toFixed() + '%';
    } else {
      return '-';
    }
  }
  
  public getPercentAudio() {
    if(this.statisticData.audio){
      return ((this.statisticData.audio.correctAnswers /  (this.statisticData.audio.correctAnswers +  this.statisticData.audio.wrongAnswers)) * 100).toFixed() + '%';
    } else {
      return '-';
    }
  }
  
  public getPercentCorrectAnswers() {
    if(this.statisticData.wordsStatistics){
      return ((+this.wordStatistic[this.currentDate].correctAnswers /  (+this.wordStatistic[this.currentDate].correctAnswers  + +this.wordStatistic[this.currentDate].wrongAnswers)) * 100).toFixed() + '%';
    } else {
      return '-';
    }
  }

  ngOnInit(): void {
    this.state.setFooterState(this.footerState);
    this.getStatistic();
  }
}
