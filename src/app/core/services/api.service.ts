import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWord } from '@core/models/word';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiService {
  private API_URL = 'https://rslangbe.herokuapp.com/';
  private WORDS_URL = `${this.API_URL}words`;
  private USERS_URL = `${this.API_URL}users`;
  private SIGNIN_URL = `${this.API_URL}signin`;

  constructor(private http: HttpClient) {}

  public register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(this.USERS_URL, {
      name,
      email,
      password
    }, httpOptions);
  }

  public login(email: string, password: string): Observable<any> {
    return this.http.post(this.SIGNIN_URL, {
      email,
      password
    }, httpOptions);
  }

  public logOut() {}
  
  public getWords(group: string, page: string): Observable<IWord[]> {
    return this.http.get<IWord[]>(this.WORDS_URL, {
      params: new HttpParams().set('group', group)
      .set('page', page)
    });
  }
}
