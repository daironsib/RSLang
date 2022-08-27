import { Component, Input } from '@angular/core';
import { IWord } from '@core/models';
import { AudioPlayerService } from '@core/services/audio-player.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent {
  public API_URL = 'https://rslangbe.herokuapp.com/';

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
  
  constructor(public audioPlayerService: AudioPlayerService) {
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
