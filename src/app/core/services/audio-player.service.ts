import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable()
export class AudioPlayerService {
  private API_URL = 'https://rslangbe.herokuapp.com/';
  public playbackEndedSource = new Subject<string>();
  public playbackEnded$ = this.playbackEndedSource.asObservable();
  public audio: HTMLAudioElement;
  public playlist: string[];
  public currentAudio: number;

  constructor() {
    this.audio = new Audio();
    this.playlist = [];
    this.currentAudio = 0;
    this.audio.addEventListener('ended', () => {
      this.playbackEndedSource.next(this.playlist[this.currentAudio += 1]);
    });
  }
  
  public newAudio(src: string[]) {
    this.playlist = [];
    this.currentAudio = 0;
    this.setPlayList(src);
  }

  public play(path: string): void {
    console.log(this.playlist);
    this.audio.src = this.API_URL + path;
    this.audio.load();
    this.audio.play();
  }

  public setPlayList(src: string[]) {
    this.playlist = src;
    console.log(this.currentAudio);
    const subscription = this.playbackEnded$.subscribe(() => {
      if (this.currentAudio === this.playlist.length) {
        subscription.unsubscribe();
      } else {
        this.play(this.playlist[this.currentAudio]);
      }
    });
    this.play(this.playlist[this.currentAudio]);
  }
}
