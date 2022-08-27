import { Injectable } from '@angular/core';
import { IWord } from '@core/models';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from '@core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  constructor(public apiService: ApiService) { }
  
  getAll(group: number, page: number): Observable<IWord[]> {
    return this.apiService.getWords(group, page)
  }
}
