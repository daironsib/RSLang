import { Component, OnInit } from '@angular/core';
import { IWord } from '@core/models';
import { ApiService } from '@core/services/api.service';
import { AudioPlayerService } from '@core/services/audio-player.service';

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

  constructor(private api: ApiService, public audioPlayerService: AudioPlayerService) { }

  ngOnInit(): void {}

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
      });
    }
  }

  private changeScreen(number: number): void {
    this.currentSlide = number;
  }

  public nextWord(): void {
    if (this.words.length !== 0 && this.currentIndexWord < this.words.length - 1) {
      this.currentIndexWord ++;
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
      this.variantWords = this.variantWords.filter((v, i, arr) =>  arr.indexOf(v) == i);
    }

    this.variantWords = this.variantWords.sort(() => Math.random() - 0.5);
  }

  private clearVariants(): void {
    this.variantWords = [];
  }

  public checkVariant(variant: string): void {
    if (variant === this.words[this.currentIndexWord].wordTranslate) {
      this.goodWords.push(this.words[this.currentIndexWord]);
    } else {
      this.badWords.push(this.words[this.currentIndexWord]);
    }

    this.nextWord();
  }

  public dontKnow(): void {
    this.badWords.push(this.words[this.currentIndexWord]);
    this.nextWord();
  }

  public resetGame(): void {
    this.words = [];
    this.variantWords = [];
    this.goodWords = [];
    this.badWords =[];
    this.currentIndexWord = 0;
    this.changeScreen(1);
  }
}
