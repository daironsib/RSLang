import { Injectable } from '@angular/core';
import { IWord, WordDifficulty } from '@core/models';
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
    return this.apiService
      .createUserWordById(this.userId, word.id, {
        difficulty: WordDifficulty.Hard,
      })
      .subscribe(() => this.getHardWords());
  }

  public removeHardWord(word: IWord) {
    this.apiService
      .deleteUserWordById(this.userId, word.id)
      .subscribe(() => this.getHardWords());
  }

  public getHardWords() {
    this.hardWords = [];
    this.apiService.getUserWords(this.userId).subscribe((data) => {
      data
        .filter((word) => word.difficulty === WordDifficulty.Hard)
        .map((word) => {
          if (word.wordId) {
            this.apiService.getWordsID(word.wordId).subscribe((data) => {
              this.hardWords.push(data);
            });
          }
        });
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
    return this.apiService
      .createUserWordById(this.userId, word.id, {
        difficulty: WordDifficulty.Learned,
      })
      .subscribe(() => this.getLearnedWords());
  }

  public getLearnedWords() {
    this.learnedWords = [];
    this.apiService.getUserWords(this.userId).subscribe((data) => {
      data
        .filter((word) => word.difficulty === WordDifficulty.Learned)
        .map((word) => {
          if (word.wordId) {
            this.apiService.getWordsID(word.wordId).subscribe((data) => {
              this.learnedWords.push(data);
            });
          }
        });
    });
    this.learnedWords = [...new Set(this.learnedWords)];
    return this.learnedWords;
  }
}
