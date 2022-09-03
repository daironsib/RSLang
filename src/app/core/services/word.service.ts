import { Injectable } from '@angular/core';
import { IWord } from '@core/models';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from '@core/services/api.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  public userId = this.tokenStorageService.getUser().id;
  public hardWords: IWord[] = [];
  public learnedWords: IWord[] = [];

  constructor(
    public apiService: ApiService,
    public tokenStorageService: TokenStorageService
  ) {}

  public getAll(group: number, page: number): Observable<IWord[]> {
    return this.apiService.getWords(group, page);
  }

  public isHardWord(word: IWord): boolean {
    return this.hardWords.find((hard) => hard.id === word.id) ? true : false;
  }

  public addHardWord(word: IWord) {
    this.apiService.createUserWords(this.userId, word.id, 'hard').subscribe();
    return this.getHardWords();
  }

  public removeHardWord(word: IWord) {
    this.apiService.deleteUserWordById(this.userId, word.id).subscribe();
    return this.getHardWords();
  }

  public getHardWords() { 
    32
    this.hardWords = [];
    this.apiService.getUserWords(this.userId).subscribe((data) => {
      data
        .filter((word) => word.difficulty === 'hard')
        .map((word) =>
          this.apiService.getWordsID(word.wordId).subscribe((data) => {
            this.hardWords.push(data);
          })
        );
    });
    this.hardWords = [...new Set(this.hardWords)];
    return this.hardWords;
  }

  public isLearnedWord(word: IWord): boolean {
    return this.learnedWords.find((learned) => learned.id === word.id)
      ? true
      : false;
  }

  public addLearnedWord(word: IWord) {
    this.apiService
      .createUserWords(this.userId, word.id, 'learned')
      .subscribe();
    return this.getLearnedWords();
  }

  public getLearnedWords() {
    this.learnedWords = [];
    this.apiService.getUserWords(this.userId).subscribe((data) => {
      data
        .filter((word) => word.difficulty === 'learned')
        .map((word) =>
          this.apiService.getWordsID(word.wordId).subscribe((data) => {
            this.learnedWords.push(data);
          })
        );
    });
    this.learnedWords = [...new Set(this.learnedWords)];
    console.log(this.learnedWords);
    return this.learnedWords;
  }
}
