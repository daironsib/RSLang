import { Component, HostListener, OnInit } from '@angular/core';
import { IGameStatistics, IOptionStatistics, IStatistics, IUserWordProgress, IUserWords, IWord, WordDifficulty } from '@core/models';
import { KEY_CODE } from '@core/models/keyEvents';
import { ApiService } from '@core/services/api.service';
import { AudioPlayerService } from '@core/services/audio-player.service';
import { TokenStorageService } from '@core/services/token-storage.service';

@Component({
  selector: 'app-audio-game',
  templateUrl: './audio-game.component.html',
  styleUrls: ['./audio-game.component.scss']
})
export class AudioGameComponent implements OnInit {
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
    lastChanged: ''
  };
  private userID = this.tokenStorage.getUser().id;
  private answerIsRight: boolean = false;

  constructor(private api: ApiService, public audioPlayerService: AudioPlayerService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void { }

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
      this.api.getWords(difficulty, this.getRandomInt(0, this.MAX_PAGE)).subscribe(
        data => {
          this.words = data;
          this.generateVariants();
          this.audioPlayerService.newAudio([this.words[this.currentIndexWord].audio]);
          this.changeScreen(2);
          this.getStatistics();
        });
    }
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

    if (this.isCorrect(variant)) {
      this.goodWords.push(this.words[this.currentIndexWord]);
      this.optionalStats.correctAnswers++;
      this.rightAnswerCounter++;
      this.wordProgress.correctAnswers++;
      this.answerIsRight = true;
      this.applyWordDifficulty();
    } else {
      this.badWords.push(this.words[this.currentIndexWord]);
      this.optionalStats.wrongAnswers++;
      this.rightAnswerCounter = 0;
      this.wordProgress.correctAnswers--;
    }

    if (this.rightAnswerCounter > this.optionalStats.longestSeries) {
      this.optionalStats.longestSeries = this.rightAnswerCounter;
    }

    this.saveUserWord();
  }

  private isCorrect(variant: string): boolean {
    return variant === this.words[this.currentIndexWord].wordTranslate;
  }

  private saveUserWord(): void {
    if (this.userID) {
      const wordID = this.words[this.currentIndexWord].id;
      this.api.createUserWords(this.userID, wordID, this.getWordPayload()).subscribe(() => {
        this.optionalStats.newWords++;
        this.saveStatistics();
      },
        err => {
          this.api.getUserWordById(this.userID, wordID).subscribe((data: IUserWords) => {
            this.updateUserWordsData(data);
            this.applyAnswerToUserWordsData();
            this.applyWordDifficulty();
            this.api.updateUserWordById(this.userID, wordID, this.getWordPayload()).subscribe(() => {
              this.saveStatistics();
            })
          });
        });
    }
  }

  private getWordPayload(): IUserWords {
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

  private updateUserWordsData(data: IUserWords): void {
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
      })
    }
  }

  private saveStatistics(): void {
    if (this.userID) {
      this.api.getStatistics(this.userID).subscribe((data: IStatistics) => {
        const optional: IOptionStatistics = {
          audio: this.optionalStats,
          sprint: data.optional?.sprint,
          wordsStatistics: data.optional?.wordsStatistics
        }

        this.api.updateStatistics(this.userID, this.learnedWords, optional).subscribe(() => {
          this.nextWord();
        });
      }, err => {
        const optional: IOptionStatistics = {
          audio: this.optionalStats
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
    } else {
      this.wordDifficulty = WordDifficulty.InProgress;
    }
  }

  public dontKnow(): void {
    this.badWords.push(this.words[this.currentIndexWord]);
    this.nextWord();
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
