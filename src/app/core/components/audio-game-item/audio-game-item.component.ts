import { Component, EventEmitter, Output, Input } from '@angular/core';
import { IWord } from '@core/models';
import { AudioPlayerService } from '@core/services/audio-player.service';

@Component({
  selector: 'app-audio-game-item',
  templateUrl: './audio-game-item.component.html',
  styleUrls: ['./audio-game-item.component.scss'],
})
export class AudioGameItemComponent {
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

  @Input()
  variants: string[] = [];

  @Output() buttonClick = new EventEmitter();
  
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

  public add(value: string): void {
    this.buttonClick.emit(value);
  }
}
