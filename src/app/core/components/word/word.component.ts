import { Component, Input } from '@angular/core';
import { IWord } from '@core/models';
import { ApiService } from '@core/services/api.service';
import { AudioPlayerService } from '@core/services/audio-player.service';
import { SvgService } from '@core/services/svg.service';
import { TokenStorageService } from '@core/services/token-storage.service';
import { WordService } from '@core/services/word.service';
import { DictionaryComponent } from '@feature/pages/dictionary/dictionary.component';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent {
  public AUDIO_ICON_URL = './assets/svg/audio.svg';
  public API_URL = 'https://rslangbe.herokuapp.com/';
  public userId = this.tokenStorageService.getUser().id;
  
  @Input()
  word: IWord = {
    id: '',
    group: 0,
    page: 0,
    word: '',
    image: '',
    audio: '',
    audioMeaning: '',
    audioExample: '',
    textMeaning: '',
    textExample: '',
    transcription: '',
    textExampleTranslate: '',
    textMeaningTranslate: '',
    wordTranslate: ''
  }
  
  constructor(public audioPlayerService: AudioPlayerService, public tokenStorageService: TokenStorageService, public apiService: ApiService, public wordService: WordService, public dictionaryComponent: DictionaryComponent, public svgService: SvgService) {
    this.word.id = '',
    this.word.group = 0,
    this.word.page = 0,
    this.word.word = '',
    this.word.image = '',
    this.word.audio = '',
    this.word.audioMeaning = '',
    this.word.audioExample = '',
    this.word.textMeaning = '',
    this.word.textExample = '',
    this.word.transcription = '',
    this.word.textExampleTranslate = '',
    this.word.textMeaningTranslate = '',
    this.word.wordTranslate = ''
  }
}
