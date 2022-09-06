import { Injectable } from '@angular/core';
import { IUserWord, IWord, WordDifficulty } from '@core/models';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from '@core/services/api.service';
import { TokenStorageService } from './token-storage.service';
import { forkJoin, map, of } from 'rxjs';
import { Subject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  public hardWords: IWord[] = [];
  public learnedWords: IWord[] = [];
  public learnedWordsSource: Subject<IWord[]> = new Subject<IWord[]>();
  public hardWordsSource: Subject<IWord[]> = new Subject<IWord[]>();
  public progressWords: IUserWord[] = [];

  constructor(
    public apiService: ApiService,
    public tokenStorageService: TokenStorageService
  ) { }

  public getLearnedWordObservable(): Observable<IWord[]> {
    return this.learnedWordsSource.asObservable();
  }

  public getHardWordObservable(): Observable<IWord[]> {
    return this.hardWordsSource.asObservable();
  }

  public getAll(group: number, page: number): Observable<IWord[]> {
    return this.apiService.getWords(group, page);
  }

  public isHardWord(word: IWord): boolean {
    return this.hardWords.find((hard) => hard.id === word.id) ? true : false;
  }

  public addHardWord(word: IWord): void {
    this.apiService.createUserWordById(this.tokenStorageService.getUser().id, word.id, { difficulty: WordDifficulty.Hard }).subscribe(
      () => this.updateWords(),
      err => {
        this.apiService.getUserWordById(this.tokenStorageService.getUser().id, word.id).subscribe(() => {
          this.apiService.updateUserWordById(this.tokenStorageService.getUser().id, word.id, { difficulty: WordDifficulty.Hard, optional: { correctAnswers: 0 } }).subscribe(() => this.updateWords())
        })
      }
    );
  }

  public addInProgressWord(word: IWord): void {
    this.apiService.createUserWordById(this.tokenStorageService.getUser().id, word.id, { difficulty: WordDifficulty.InProgress }).subscribe(
      () => this.updateWords(),
      err => {
        this.apiService.getUserWordById(this.tokenStorageService.getUser().id, word.id).subscribe(() => {
          this.apiService.updateUserWordById(this.tokenStorageService.getUser().id, word.id, { difficulty: WordDifficulty.InProgress }).subscribe(() => this.updateWords())
        })
      }
    );
  }

  public getHardWords(): Observable<IWord[]> {
    return this.apiService.getUserWords(this.tokenStorageService.getUser().id).pipe(
      switchMap((data) => {
        return this.updateHardWords(data).pipe(
          map(() => {
            this.getProgressWords(data);
            return this.hardWords;
          })
        )
      }),
    );
  }

  public isLearnedWord(word: IWord): boolean {
    return this.learnedWords.find((learned) => learned.id === word.id)
      ? true
      : false;
  }

  public getProgressWords(data: IUserWord[]): void {
    this.progressWords = data.filter((word) => word.difficulty === WordDifficulty.InProgress || word.difficulty === WordDifficulty.HardAndInProgress);
  }

  public isProgressWord(id: string): boolean {
    return this.progressWords.find((word) => word.wordId === id)
    ? true
    : false;
  }

  public addLearnedWord(word: IWord): void {
    this.apiService.createUserWordById(this.tokenStorageService.getUser().id, word.id, { difficulty: WordDifficulty.Learned }).subscribe(
      () => this.updateWords(),
      err => {
        this.apiService.getUserWordById(this.tokenStorageService.getUser().id, word.id).subscribe(() => {
          this.apiService.updateUserWordById(this.tokenStorageService.getUser().id, word.id, { difficulty: WordDifficulty.Learned }).subscribe(() => this.updateWords())
        })
      }
    );
  }

  public getLearnedWords(): Observable<IWord[]> {
    return this.apiService.getUserWords(this.tokenStorageService.getUser().id).pipe(
      switchMap((data: IUserWord[]) => {
        return this.updateLearnWords(data).pipe(
          map(() => {
            this.getProgressWords(data);
            return this.learnedWords;
          })
        );
      })
    )
  }

  private updateWords(): void {
    this.apiService.getUserWords(this.tokenStorageService.getUser().id).subscribe((data) => {
      this.updateLearnWords(data).subscribe((words: IWord[]) => {
        this.learnedWords = [...new Set(words)];
        this.learnedWordsSource.next(this.learnedWords);
        this.getProgressWords(data);
      });
      this.updateHardWords(data).subscribe((words: IWord[]) => {
        this.hardWords = [...new Set(words)];
        this.hardWordsSource.next(this.hardWords);
        this.getProgressWords(data);
      });
    });
  }

  public updateLearnWords(data: IUserWord[]): Observable<IWord[]> {
    this.learnedWords = [];
    const getLearnedObs: Array<Observable<IWord>> = [];
    data
      .filter((word) => word.difficulty === WordDifficulty.Learned)
      .map((word) => {
        if (word.wordId) {
          getLearnedObs.push(this.apiService.getWordsID(word.wordId));
        }
      });

    if (getLearnedObs.length) {
      return forkJoin(getLearnedObs).pipe(
        map((words: IWord[]) => this.learnedWords = [...new Set(words)])
      )
    } else {
      return of([]);
    }
  }

  public updateHardWords(data: IUserWord[]): Observable<IWord[]> {
    this.hardWords = [];
    const getHardObs: Array<Observable<IWord>> = [];

    data
      .filter((word) => word.difficulty === WordDifficulty.Hard || word.difficulty === WordDifficulty.HardAndInProgress)
      .map((word) => {
        if (word.wordId) {
          getHardObs.push(this.apiService.getWordsID(word.wordId));
        }
      });

    if (getHardObs.length) {
      return forkJoin(getHardObs).pipe(
        map((words: IWord[]) => this.hardWords = [...new Set(words)])
      )
    } else {
      return of([]);
    }
  }
}
