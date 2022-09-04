import { Injectable } from '@angular/core';
import { IFilterResponse, IUserWords, IWord } from '@core/models';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from '@core/services/api.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  public userId = this.tokenStorageService.getUser().id;
  public hardWords: IWord[] = [];

  constructor(
    public apiService: ApiService,
    public tokenStorageService: TokenStorageService
  ) {}

  getAll(group: number, page: number): Observable<IWord[]> {
    return this.apiService.getWords(group, page);
  }

 isHardWord(word: IWord) {
  
  return this.apiService.getUserWordById(this.userId, word.id)
  .subscribe(word => {
    word.difficulty === 'hard';
  });
    /* this.getHardWords().subscribe((value: IFilterResponse[]) => this.hardWords = value[0].paginatedResults);
   this.hardWords.forEach((word: IWordResponse) => {
    if(word._id === wordId){
      
      console.log( true);
    }
    return word._id == wordId;
   }); */
  }

  addHardWord(word: IWord) {
    return this.apiService
      .createUserWords(this.userId, word.id, 'hard')
      .subscribe((data) => console.log(data.difficulty));
  }

  /* removeHardWord(wordId: string) {
    return this.apiService
      .deleteUserWordById(this.userId, wordId)
      .subscribe(        
        err => console.log('HTTP Error', err), 
      );
  } */

  addLearnedWord(word: IWord) {
    return this.apiService
      .createUserWords(this.userId, word.id, 'learned')
      .subscribe((data) => console.log(data.difficulty));
  }

  getHardWords() {
    this.apiService.getUserWords(this.userId).subscribe(
      data => { 
        data.filter(word => word.difficulty === 'hard').map(word => 
          this.apiService.getWordsID(word.wordId)
          .subscribe(data => {
            this.hardWords.push(data);
            return this.hardWords;
          })
        )
  })
  }
}
