import { Component, OnInit } from '@angular/core';
import { FooterService } from '@core/services/footer.service';
import { ApiService } from '@core/services/api.service';
import { IWord } from '@core/models';
import { SprintGameWord, SprintGameWordStatistic } from '@core/models/sprint-game';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Component({
  selector: 'app-sprint-game',
  templateUrl: './sprint-game.component.html',
  styleUrls: ['./sprint-game.component.scss'],
})
export class SprintGameComponent implements OnInit {
  public words: IWord[] = [];
  public footerState: boolean;
  public sprintGameWords: SprintGameWord[] = [];
  public sprintGameWordStatistic: SprintGameWordStatistic[] = [];
  public sprintGameSource: ReplaySubject<SprintGameWord> = new ReplaySubject(1);
  public showStatistic: boolean = false;
  public sprintWordObservable: Observable<SprintGameWord>;
  public score: number = 0;
  public scoreRate: number = 1;
  public winStreak: number = 0;

  constructor(private api: ApiService, public state: FooterService) {
    this.footerState = false;
    this.sprintWordObservable = this.sprintGameSource.asObservable();
  }

  ngOnInit(): void {
    this.state.setFooterState(this.footerState);
  }

  public getWords(group: number) {
    const page = Math.floor(Math.random() * 29);
    this.api.getWords(group, page).subscribe(data => {
      this.words = data;
      this.generateSprintGameWords();
      this.getSprintWord();
    });
  }

  public generateSprintGameWords() {
    const randomTranslations = this.words.map((wordItem) => wordItem.wordTranslate).sort(() => Math.random() - 0.5);
    this.sprintGameWords = this.words.map((wordItem, index) => ({
      word: wordItem.word,
      correctTranslation: wordItem.wordTranslate,
      translation:[wordItem.wordTranslate, randomTranslations[index]][Math.floor(Math.random() * 2)]
    }))
  }

  public getSprintWord() {
    if (this.sprintGameWords.length > 0) {
      const word = this.sprintGameWords.pop();
      if (word) {
        this.sprintGameSource.next(word);
      }
    } else {
      this.showStatistic = true;
      this.sprintGameSource.complete();
    }
  }

  public scorePoints(isCorrectAnswer: boolean) {
    if (isCorrectAnswer) {
      this.winStreak++;

      if (this.winStreak === 4) {
        this.winStreak = 0;
        this.scoreRate *= 2;
      }

      this.score += 10 * this.scoreRate;
    } else {
      this.winStreak = 0;
      this.scoreRate = 1;
    }
    
  }

  public checkTrueAnswer(wordItem: SprintGameWord) {
    const wordStatistic: SprintGameWordStatistic = {
      word: wordItem.word,
      isCorrectAnswer: wordItem.translation === wordItem.correctTranslation
    }
    this.scorePoints(wordStatistic.isCorrectAnswer);
    
    this.sprintGameWordStatistic.push(wordStatistic);
    this.getSprintWord();
  }
  
  public checkFalseAnswer(wordItem: SprintGameWord) {
    const wordStatistic: SprintGameWordStatistic = {
      word: wordItem.word,
      isCorrectAnswer: wordItem.translation !== wordItem.correctTranslation
    }
    this.scorePoints(wordStatistic.isCorrectAnswer);

    this.sprintGameWordStatistic.push(wordStatistic);
    this.getSprintWord();
  }
}
