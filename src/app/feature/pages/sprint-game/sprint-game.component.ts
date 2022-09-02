import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FooterService } from '@core/services/footer.service';
import { ApiService } from '@core/services/api.service';
import { IWord } from '@core/models';
import { SprintGameWord, SprintGameWordStatistic } from '@core/models/sprint-game';
import { interval, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { KEY_CODE } from '@core/models/keyEvents';

@Component({
  selector: 'app-sprint-game',
  templateUrl: './sprint-game.component.html',
  styleUrls: ['./sprint-game.component.scss'],
})
export class SprintGameComponent implements OnInit, OnDestroy {
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
  public time: number = 60;
  public destroyTimer$: Subject<void> = new Subject();
  public wordItem!: SprintGameWord;
  public isGameActive: boolean = false;

  constructor(private api: ApiService, public state: FooterService) {
    this.footerState = false;
    this.sprintWordObservable = this.sprintGameSource.asObservable();
    this.sprintWordObservable.pipe(takeUntil(this.destroyTimer$)).subscribe(word => this.wordItem = word);
  }

  ngOnInit(): void {
    this.state.setFooterState(this.footerState);
  }

  ngOnDestroy(): void {
    this.destroyTimer$.next();
    this.destroyTimer$.complete();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.LEFT && this.isGameActive) {
      this.checkTrueAnswer(this.wordItem);
    }
    if (event.keyCode === KEY_CODE.RIGHT && this.isGameActive) {
      this.checkFalseAnswer(this.wordItem);
    }
  }

  public getWords(group: number) {
    const page = Math.floor(Math.random() * 29);
    this.api.getWords(group, page).subscribe(data => {
      this.words = data;
      this.isGameActive = true;
      this.generateSprintGameWords();
      this.getSprintWord();
      this.startTimer();
    });
  }

  public generateSprintGameWords() {
    const randomTranslations = this.words.map((wordItem) => wordItem.wordTranslate).sort(() => Math.random() - 0.5);
    this.sprintGameWords = this.words.map((wordItem, index) => ({
      word: wordItem.word,
      correctTranslation: wordItem.wordTranslate,
      transcription: wordItem.transcription,
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
    const trueSound = new Audio();
    trueSound.src = '/assets/sounds/true.mp3';
    const falseSound = new Audio();
    falseSound.src = '/assets/sounds/false.mp3';

    if (isCorrectAnswer) {
      this.winStreak++;

      if (this.winStreak === 4) {
        this.winStreak = 0;
        this.scoreRate *= 2;
      }
      trueSound.play();
      this.score += 10 * this.scoreRate;
    } else {
      this.winStreak = 0;
      this.scoreRate = 1;
      falseSound.play();
    }
    
  }

  public checkTrueAnswer(wordItem: SprintGameWord) {
    const wordStatistic: SprintGameWordStatistic = {
      word: wordItem.word,
      translation: wordItem.correctTranslation,
      transcription:  wordItem.transcription,
      isCorrectAnswer: wordItem.translation === wordItem.correctTranslation
    }
    this.scorePoints(wordStatistic.isCorrectAnswer);
    
    this.sprintGameWordStatistic.push(wordStatistic);
    this.getSprintWord();
  }
  
  public checkFalseAnswer(wordItem: SprintGameWord) {
    const wordStatistic: SprintGameWordStatistic = {
      word: wordItem.word,
      translation: wordItem.correctTranslation,
      transcription:  wordItem.transcription,
      isCorrectAnswer: wordItem.translation !== wordItem.correctTranslation
    }
    this.scorePoints(wordStatistic.isCorrectAnswer);

    this.sprintGameWordStatistic.push(wordStatistic);
    this.getSprintWord();
  }

  public startTimer() {
    interval(1000).pipe(
      takeUntil(this.destroyTimer$),
      map(() => {
        console.log('4to nibud');
        if (this.time > 0) {
           this.time--;
        } else {
          this.destroyTimer$.next();
          this.destroyTimer$.complete();
          this.showStatistic = true;
          this.isGameActive = false;
        }
      })
    ).subscribe();
  }

  public restartGame() {
    this.showStatistic = false;
    this.sprintGameWords = [];
    this.sprintGameWordStatistic = [];
    this.score = 0;
    this.scoreRate = 1;
    this.winStreak = 0;
    this.time = 60;
    this.destroyTimer$ = new Subject();
    this.words = [];
  }
}
