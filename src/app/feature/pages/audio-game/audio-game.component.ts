import { Component, HostListener, OnInit } from '@angular/core';
import { IGameStatistics, IOptionStatistics, IStatistics, IUserWordProgress, IUserWord, IWord, WordDifficulty, IWordStatistics } from '@core/models';
import { KEY_CODE } from '@core/models/keyEvents';
import { ApiService } from '@core/services/api.service';
import { AudioPlayerService } from '@core/services/audio-player.service';
import { TokenStorageService } from '@core/services/token-storage.service';
import { FooterService } from '@core/services/footer.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-audio-game',
  templateUrl: './audio-game.component.html',
  styleUrls: ['./audio-game.component.scss']
})
export class AudioGameComponent implements OnInit {
  public currentDate = `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`;
  public wordStatistic: IWordStatistics = {
    [this.currentDate]: {
      newWords: 0,
      learnedWords: 0,
      correctAnswers: 0,
      wrongAnswers: 0
    }
  };
  public footerState: boolean;
  private MAX_PAGE: number = 29;
  public currentSlide: number = 1;
  public currentIndexWord: number = 0;
  public form: any = {
    difficulty: 1
  };
  public words: IWord[] = [];
  public variantWords: string[] = [];
  public goodWords: IWord[] = [];
  public badWords: IWord[] = [];
  private wordDifficulty = WordDifficulty.InProgress;
  private wordProgress: IUserWordProgress = {
    correctAnswers: 0
  };

  private rightAnswerCounter: number = 0;
  private learnedWords: number = 0;
  private optionalStats: IGameStatistics = {
    correctAnswers: 0,
    wrongAnswers: 0,
    learnedWords: 0,
    longestSeries: 0,
    newWords: 0,
    lastChanged: this.currentDate
  };
  private userID = this.tokenStorage.getUser().id;
  private answerIsRight: boolean = false;

  constructor(private api: ApiService, public audioPlayerService: AudioPlayerService, private tokenStorage: TokenStorageService, public state: FooterService, private route: ActivatedRoute) {
    this.footerState = false;
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if (Object.keys(params).length > 0) {
          const page = params['page'];
          const group = params['group'];
          this.getWordsFromDictionary(group, page);
        }
      });
    this.state.setFooterState(this.footerState);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.currentSlide === 2) {
      if (event.keyCode === KEY_CODE.ENTER) {
        this.dontKnow();
      }

      if (event.keyCode === KEY_CODE.SPACE) {
        this.audioPlayerService.newAudio([this.words[this.currentIndexWord].audio]);
      }

      if (event.keyCode === KEY_CODE.KEY1) {
        this.checkVariant(this.variantWords[0]);
      }

      if (event.keyCode === KEY_CODE.KEY2) {
        this.checkVariant(this.variantWords[1]);
      }

      if (event.keyCode === KEY_CODE.KEY3) {
        this.checkVariant(this.variantWords[2]);
      }

      if (event.keyCode === KEY_CODE.KEY4) {
        this.checkVariant(this.variantWords[3]);
      }

      if (event.keyCode === KEY_CODE.KEY5) {
        this.checkVariant(this.variantWords[4]);
      }
    }
  }

  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public onSubmit(): void {
    const { difficulty } = this.form;

    if (difficulty) {
      this.getWordsFromDictionary(difficulty, this.getRandomInt(0, this.MAX_PAGE));
    }
  }

  public getWordsFromDictionary(group: number, page: number): void {
    this.api.getWords(group, page).subscribe(
      data => {
        this.words = data;
        this.generateVariants();
        this.audioPlayerService.newAudio([this.words[this.currentIndexWord].audio]);
        this.changeScreen(2);
        this.getStatistics();
      });
  }

  private changeScreen(number: number): void {
    this.currentSlide = number;
  }

  public nextWord(): void {
    this.resetUserWordsData();
    if (this.words.length !== 0 && this.currentIndexWord < this.words.length - 1) {
      this.currentIndexWord++;
      this.generateVariants();
      this.audioPlayerService.newAudio([this.words[this.currentIndexWord].audio]);
    } else {
      this.changeScreen(3);
    }
  }

  private generateVariants(): void {
    this.clearVariants();

    this.variantWords.push(this.words[this.currentIndexWord].wordTranslate);

    while (this.variantWords.length < 5) {
      let index = this.getRandomInt(0, this.words.length);
      this.variantWords.push(this.words[index].wordTranslate);
      this.variantWords = this.variantWords.filter((v, i, arr) => arr.indexOf(v) == i);
    }

    this.variantWords = this.variantWords.sort(() => Math.random() - 0.5);
  }

  private clearVariants(): void {
    this.variantWords = [];
  }

  public checkVariant(variant: string): void {
    const trueSound = new Audio();
    trueSound.src = './assets/sounds/true.mp3';
    const falseSound = new Audio();
    falseSound.src = './assets/sounds/false.mp3';

    if (this.isCorrect(variant)) {
      this.goodWords.push(this.words[this.currentIndexWord]);
      this.optionalStats.correctAnswers++;
      this.wordStatistic[this.currentDate].correctAnswers++;
      this.rightAnswerCounter++;
      this.wordProgress.correctAnswers++;
      this.answerIsRight = true;
      this.applyWordDifficulty();
      trueSound.play();
    } else {
      this.badWords.push(this.words[this.currentIndexWord]);
      this.wordStatistic[this.currentDate].wrongAnswers++;
      this.optionalStats.wrongAnswers++;
      this.rightAnswerCounter = 0;
      this.wordProgress.correctAnswers--;
      falseSound.play();
    }

    if (this.rightAnswerCounter > this.optionalStats.longestSeries) {
      this.optionalStats.longestSeries = this.rightAnswerCounter;
    }

    this.sendUserWord();
  }

  private isCorrect(variant: string): boolean {
    return variant === this.words[this.currentIndexWord].wordTranslate;
  }

  private sendUserWord(): void {
    if (this.userID) {
      const wordID = this.words[this.currentIndexWord].id;
      this.api.createUserWordById(this.userID, wordID, this.getWordPayload()).subscribe(() => {
        this.optionalStats.newWords++;
        this.wordStatistic[this.currentDate].newWords++;
        this.sendStatistics();
      },
        err => {
          this.api.getUserWordById(this.userID, wordID).subscribe((data: IUserWord) => {
            this.updateUserWordsData(data);
            this.applyAnswerToUserWordsData();
            this.applyWordDifficulty();
            this.api.updateUserWordById(this.userID, wordID, this.getWordPayload()).subscribe(() => {
              this.sendStatistics();
            })
          });
        });
    } else {
      this.nextWord();
    }
  }

  private getWordPayload(): IUserWord {
    return {
      difficulty: this.wordDifficulty,
      optional: this.wordProgress
    };
  }

  private resetUserWordsData(): void {
    this.answerIsRight = false;
    this.wordDifficulty = WordDifficulty.InProgress;;
    this.wordProgress.correctAnswers = 0;
  }

  private updateUserWordsData(data: IUserWord): void {
    if (data.difficulty && data.optional) {
      this.wordDifficulty = data.difficulty;
      this.wordProgress = data.optional;
    }
  }

  private applyAnswerToUserWordsData(): void {
    if (this.answerIsRight) {
      this.wordProgress.correctAnswers++
    } else {
      this.wordProgress.correctAnswers--
    }
  }

  private getStatistics(): void {
    if (this.userID) {
      this.api.getStatistics(this.userID).subscribe((data: IStatistics) => {
        if (data.learnedWords) {
          this.learnedWords = data.learnedWords;
        }

        if (data.optional.audio) {
          this.optionalStats = data.optional.audio;
        }
        if (data.optional.wordsStatistics) {
          this.wordStatistic = data.optional.wordsStatistics
        }
      })
    }
  }

  private sendStatistics(): void {
    if (this.userID) {
      this.api.getStatistics(this.userID).subscribe((data: IStatistics) => {
        const optional: IOptionStatistics = {
          audio: this.optionalStats,
          sprint: data.optional?.sprint,
          wordsStatistics: this.wordStatistic
        }

        this.api.updateStatistics(this.userID, this.learnedWords, optional).subscribe(() => {
          this.nextWord();
        });
      }, err => {
        const optional: IOptionStatistics = {
          audio: this.optionalStats,
          wordsStatistics: this.wordStatistic
        }
        this.api.updateStatistics(this.userID, this.learnedWords, optional).subscribe(() => {
          this.nextWord();
        });
      });
    }
  }

  private applyWordDifficulty(): void {
    if (this.wordProgress.correctAnswers >= 3) {
      this.wordDifficulty = WordDifficulty.Learned;
      this.optionalStats.learnedWords++;
      this.wordStatistic[this.currentDate].learnedWords++;
    } else if (this.wordDifficulty === WordDifficulty.Hard) {
      this.wordDifficulty = WordDifficulty.HardAndInProgress;
    } else {
      this.wordDifficulty = WordDifficulty.InProgress;
    }
  }

  public dontKnow(): void {
    this.badWords.push(this.words[this.currentIndexWord]);
    this.wordStatistic[this.currentDate].wrongAnswers++;
    this.optionalStats.wrongAnswers++;
    this.rightAnswerCounter = 0;
    this.wordProgress.correctAnswers--;

    if (this.rightAnswerCounter > this.optionalStats.longestSeries) {
      this.optionalStats.longestSeries = this.rightAnswerCounter;
    }

    this.sendUserWord();
  }

  public resetGame(): void {
    this.words = [];
    this.variantWords = [];
    this.goodWords = [];
    this.badWords = [];
    this.currentIndexWord = 0;
    this.changeScreen(1);
  }
}
