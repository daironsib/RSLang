import { Component, OnInit } from '@angular/core';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-audio-game',
  templateUrl: './audio-game.component.html',
  styleUrls: ['./audio-game.component.scss']
})
export class AudioGameComponent implements OnInit {
  public currentSlide: number = 1;
  public form: any = {
    difficulty: 1
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const { difficulty } = this.form;

    console.log(difficulty);
  }

  changeScreen(number: number): void {
    this.currentSlide = number;

    if (this.currentSlide === 2) {
      this.api.getWords(1, 1).subscribe(
        data => {
         console.log(data);
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}
