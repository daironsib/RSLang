import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '@core/services/token-storage.service';
import { ILogin, IOptionStatistics, IRegister, ISettings, IStatistics, IUserWord, IWord, IFilterResponse } from '@core/models';

@Injectable()
export class ApiService {
  private API_URL = 'https://rslangbe.herokuapp.com/';
  private WORDS_URL = `${this.API_URL}words`;
  private USERS_URL = `${this.API_URL}users`;
  private SIGNIN_URL = `${this.API_URL}signin`;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  private getHttpHeader() {
    const token = this.tokenStorage.getToken();

    return {
      headers: token ?
      new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${this.tokenStorage.getToken()}`
      }) : 
      new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  }

  // Auth

  public register(name: string, email: string, password: string): Observable<IRegister> {
    return this.http.post<IRegister>(this.USERS_URL, { name, email, password }, this.getHttpHeader());
  }

  public login(email: string, password: string): Observable<ILogin> {
    return this.http.post<ILogin>(this.SIGNIN_URL, { email, password }, this.getHttpHeader());
  }

  // Words
  
  public getWords(group: number, page: number): Observable<IWord[]> {
    return this.http.get<IWord[]>(this.WORDS_URL, {
      params: new HttpParams().set('group', group)
      .set('page', page)
    });
  }

  public getWordsID(id: string): Observable<IWord> {
    return this.http.get<IWord>(`${this.WORDS_URL}/${id}`);
  }

  // User Words

  public getUserWords(id: string): Observable<IUserWord[]> {
    return this.http.get<IUserWord[]>(`${this.USERS_URL}/${id}/words`, this.getHttpHeader());
  }

  public createUserWordById(id: string, wordId: string, payload: IUserWord): Observable<IUserWord> {
    return this.http.post<IUserWord>(`${this.USERS_URL}/${id}/words/${wordId}`, payload, this.getHttpHeader());
  }

  public getUserWordById(id: string, wordId: string): Observable<IUserWord> {
    return this.http.get<IUserWord>(`${this.USERS_URL}/${id}/words/${wordId}`, this.getHttpHeader());
  }

  public updateUserWordById(id: string, wordId: string, payload: IUserWord): Observable<IUserWord> {
    return this.http.put<IUserWord>(`${this.USERS_URL}/${id}/words/${wordId}`, payload, this.getHttpHeader());
  }

  public deleteUserWordById(id: string, wordId: string): Observable<any> {
    return this.http.delete(`${this.USERS_URL}/${id}/words/${wordId}`, this.getHttpHeader());
  }

  // AggregatedWords

  public getAggregatedWords(id: string, options?: string): Observable<IFilterResponse[]> {
    return this.http.get<IFilterResponse[]>(`${this.USERS_URL}/${id}/aggregatedWords${options}`, this.getHttpHeader());
  }

  // Statistics

  public getStatistics(id: string): Observable<IStatistics> {
    return this.http.get<IStatistics>(`${this.USERS_URL}/${id}/statistics`, this.getHttpHeader());
  }

  public updateStatistics(id: string, learnedWords: number, optional: IOptionStatistics): Observable<IStatistics> {
    return this.http.put<IStatistics>(`${this.USERS_URL}/${id}/statistics`, {
      learnedWords,
      optional
    }, this.getHttpHeader());
  }

  // Settings

  public getSettings(id: string): Observable<ISettings> {
    return this.http.get<ISettings>(`${this.USERS_URL}/${id}/settings`, this.getHttpHeader());
  }

  public updateSettings(id: string, wordsPerDay: number): Observable<ISettings> {
    return this.http.put<ISettings>(`${this.USERS_URL}/${id}/settings`, {
      wordsPerDay,
      'optional': {}
    }, this.getHttpHeader());
  }
}
