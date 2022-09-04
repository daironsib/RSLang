import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FooterService } from '@core/services/footer.service';
import { ApiService } from '@core/services/api.service';
import { IGameStatistics, IOptionStatistics, IStatistics, IUserWord, IUserWordProgress, IWord, IWordStatistics, WordDifficulty } from '@core/models';
import { SprintGameWord, SprintGameWordStatistic } from '@core/models/sprint-game';
import { interval, Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { KEY_CODE } from '@core/models/keyEvents';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService  } from '@core/services/token-storage.service'

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
  public sprintGameSource!: ReplaySubject<SprintGameWord>;
  public showStatistic: boolean = false;
  public sprintWordObservable!: Observable<SprintGameWord>;
  public score: number = 0;
  public scoreRate: number = 1;
  public winStreak: number = 0;
  public time: number = 60;
  public destroyTimer$: Subject<void> = new Subject();
  public wordItem!: SprintGameWord;
  public isGameActive: boolean = false;
  public page!: number;
  public group!: number;
  public skipStartScreen: boolean = false;
  public longestSeries: number = 0;
  public storedLongestSeries: number = 0;
  public intervalSubscription!: Subscription;

  constructor(private api: ApiService, public state: FooterService, private route: ActivatedRoute, private token: TokenStorageService) {
    this.footerState = false;
    this.setupWordSubject();
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if (Object.keys(params).length > 0) {
          this.page = params['page'];
          this.group = params['group'];
          this.skipStartScreen = true;
          this.getWords(this.group, this.page);
        }
      });
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

  public setupWordSubject() {
    this.sprintGameSource = new ReplaySubject(1);
    this.sprintWordObservable = this.sprintGameSource.asObservable();
    this.sprintWordObservable.pipe(takeUntil(this.destroyTimer$)).subscribe(word => this.wordItem = word);
  }

  public getWords(group: number, page: number = Math.floor(Math.random() * 29)) {
    this.api.getWords(group, page).subscribe(data => {
      this.words = data;
      this.isGameActive = true;
      this.generateSprintGameWords();
      this.getSprintWord();
      this.startTimer();
    });
  }

  public generateSprintGameWords() {
    const randomTranslations = this.words.map((wordItem: IWord) => wordItem.wordTranslate).sort(() => Math.random() - 0.5);

    this.sprintGameWords = this.words.map((wordItem: IWord, index: number) => ({
      wordId: wordItem.id,
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
      this.intervalSubscription.unsubscribe();
      this.showStatistic = true;
      this.isGameActive = false;
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
      this.longestSeries++;

      if (this.winStreak === 4) {
        this.winStreak = 0;
        this.scoreRate *= 2;
      }
      trueSound.play();
      this.score += 10 * this.scoreRate;
      if (this.storedLongestSeries < this.longestSeries) {
        this.storedLongestSeries = this.longestSeries;
      }
    } else {
      this.winStreak = 0;
      this.scoreRate = 1;
      this.longestSeries = 0;
 
      falseSound.play();
    }
  }

  public checkTrueAnswer(wordItem: SprintGameWord) {
    const wordStatistic: SprintGameWordStatistic = {
      wordId: wordItem.wordId,
      word: wordItem.word,
      translation: wordItem.correctTranslation,
      transcription:  wordItem.transcription,
      isCorrectAnswer: wordItem.translation === wordItem.correctTranslation
    }

    this.scorePoints(wordStatistic.isCorrectAnswer); 
    this.sprintGameWordStatistic.push(wordStatistic);
    this.sendWordStatistics(wordStatistic);
    this.getSprintWord();
    console.log(this.storedLongestSeries);
  }
  
  public checkFalseAnswer(wordItem: SprintGameWord) {
    const wordStatistic: SprintGameWordStatistic = {
      wordId: wordItem.wordId,
      word: wordItem.word,
      translation: wordItem.correctTranslation,
      transcription:  wordItem.transcription,
      isCorrectAnswer: wordItem.translation !== wordItem.correctTranslation
    }

    this.scorePoints(wordStatistic.isCorrectAnswer);
    this.sprintGameWordStatistic.push(wordStatistic);
    this.sendWordStatistics(wordStatistic);
    this.getSprintWord();
    console.log(this.storedLongestSeries);
  }

  public startTimer() {
    this.intervalSubscription = interval(1000).pipe(
      map(() => {
        if (this.time > 0) {
           this.time--;
        } else {
          this.destroyTimer$.next();
          this.destroyTimer$.complete();
          this.showStatistic = true;
          this.isGameActive = false;
          this.intervalSubscription.unsubscribe();
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
    this.longestSeries = 0;
    this.storedLongestSeries = 0;
    this.destroyTimer$ = new Subject();
    this.words = [];
    this.setupWordSubject();

    if (this.skipStartScreen) {
      this.getWords(this.group, this.page);
    }
  }

  public generateSprintStatistic(wordStatistic: SprintGameWordStatistic, payload: IUserWord, isNewWord: boolean): IGameStatistics {
    return {
      correctAnswers: wordStatistic.isCorrectAnswer ? 1 : 0,
      wrongAnswers: wordStatistic.isCorrectAnswer ? 0 : 1,
      newWords: isNewWord ? 1 : 0,
      learnedWords: (payload.difficulty === WordDifficulty.Learned) ? 1 : 0,
      longestSeries: this.storedLongestSeries,
      lastChanged: `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`
    }
  }

  public updateSprintStatistic(data: IGameStatistics, wordStatistic: SprintGameWordStatistic, payload: IUserWord, isNewWord: boolean): IGameStatistics {
    const currentDate = `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`;
    if (currentDate !== data.lastChanged) {
      return this.generateSprintStatistic(wordStatistic, payload, isNewWord);
    }
    return {
      correctAnswers: wordStatistic.isCorrectAnswer ? data.correctAnswers + 1 : data.correctAnswers,
      wrongAnswers: wordStatistic.isCorrectAnswer ? data.wrongAnswers : data.wrongAnswers + 1,
      newWords: isNewWord ? data.newWords + 1 : data.newWords,
      learnedWords: (payload.difficulty === WordDifficulty.Learned) ? data.learnedWords + 1 : data.learnedWords,
      longestSeries: (data.longestSeries < this.storedLongestSeries) ? this.storedLongestSeries : data.longestSeries,
      lastChanged: currentDate
    }
  }

  public sendWordStatistics(wordStatistic: SprintGameWordStatistic): void {
    const userId = this.token.getUser().id;

    if (userId) {
      const optional: IUserWordProgress = {
        correctAnswers: wordStatistic.isCorrectAnswer ? 1 : 0
      }
      const payload: IUserWord = {difficulty: WordDifficulty.InProgress, optional};

      this.api.createUserWordById(userId, wordStatistic.wordId, payload).subscribe(
        () => {
          this.sendStatistics(wordStatistic, payload, true);
        },
        (error) => {
          this.api.getUserWordById(userId, wordStatistic.wordId).subscribe((userWord: IUserWord) => {
            const payload = this.updateOptionalAndDifficult(userWord, wordStatistic);

            this.api.updateUserWordById(userId, wordStatistic.wordId, payload).subscribe(
              () => {
                this.sendStatistics(wordStatistic, payload, false);
              }
            )
          })
        }
      )
    }
  }
  
  public updateOptionalAndDifficult(userWord: IUserWord, wordStatistic: SprintGameWordStatistic): {optional: IUserWordProgress, difficulty: WordDifficulty} {
    let difficulty: WordDifficulty = WordDifficulty.InProgress;
    let optional: IUserWordProgress;

    if (userWord.optional) {
      optional = {
        correctAnswers: wordStatistic.isCorrectAnswer 
          ? userWord.optional?.correctAnswers + 1 
          : this.decreaseCorrectAnswers(userWord.optional?.correctAnswers)
      }
      if (optional.correctAnswers >= 3) {
        difficulty = WordDifficulty.Learned
      }
    } else {
      optional = { correctAnswers: 0 }
    }

    if (difficulty !== WordDifficulty.Learned) {
      difficulty = userWord.difficulty === WordDifficulty.Hard 
        ? WordDifficulty.HardAndInProgress 
        : WordDifficulty.InProgress;
    }
    return {optional, difficulty}
  }

  public decreaseCorrectAnswers(correctAnswers: number): number {
    if (correctAnswers >= 1) {
      return correctAnswers - 1;
    } else return 0;
  }

  public sendStatistics(wordStatistic: SprintGameWordStatistic, payload: IUserWord, isNewWord: boolean) {
    const userId = this.token.getUser().id;

    if (userId) {
      this.api.getStatistics(userId).subscribe((data: IStatistics) => {
        const optional: IOptionStatistics = {
          audio: data.optional?.audio,
          wordsStatistics: data.optional?.wordsStatistics
            ? this.updateWordStatistics(data.optional?.wordsStatistics, wordStatistic, payload, isNewWord) 
            : this.generateWordStatistics(wordStatistic, payload, isNewWord),
          sprint: data.optional.sprint 
            ? this.updateSprintStatistic(data.optional?.sprint, wordStatistic, payload, isNewWord) 
            : this.generateSprintStatistic(wordStatistic, payload, isNewWord),
        }
        this.api.updateStatistics(userId, 0, optional).subscribe();
      }, error => {
        const optional: IOptionStatistics = {
          sprint: this.generateSprintStatistic(wordStatistic, payload, isNewWord),
          wordsStatistics: this.generateWordStatistics(wordStatistic, payload, isNewWord)
        }
        this.api.updateStatistics(userId, 0, optional).subscribe();
      });
    }
  }

  public generateWordStatistics(wordStatistic: SprintGameWordStatistic, payload: IUserWord, isNewWord: boolean): IWordStatistics {
    const currentDate = `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`;
    
    return {
      [currentDate]: {
        newWords: isNewWord ? 1 : 0,
        learnedWords: (payload.difficulty === WordDifficulty.Learned) ? 1 : 0,
        correctAnswers: wordStatistic.isCorrectAnswer ? 1 : 0,
        wrongAnswers: wordStatistic.isCorrectAnswer ? 0 : 1,
      }
    }
  }

  public updateWordStatistics(data: IWordStatistics, wordStatistic: SprintGameWordStatistic, payload: IUserWord, isNewWord: boolean): IWordStatistics {
    const currentDate = `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`;

    if (!data[currentDate]) {
      return this.generateWordStatistics(wordStatistic, payload, isNewWord);
    }
    
    return {
      [currentDate]: {
        newWords: isNewWord ? data[currentDate].newWords + 1 : data[currentDate].newWords,
        learnedWords: (payload.difficulty === WordDifficulty.Learned) 
          ? data[currentDate].learnedWords + 1 
          : data[currentDate].learnedWords,
        correctAnswers: wordStatistic.isCorrectAnswer 
          ? data[currentDate].correctAnswers + 1 
          : data[currentDate].correctAnswers,
        wrongAnswers: wordStatistic.isCorrectAnswer 
          ? data[currentDate].wrongAnswers 
          : data[currentDate].wrongAnswers + 1,
      }
    }
  }
}
