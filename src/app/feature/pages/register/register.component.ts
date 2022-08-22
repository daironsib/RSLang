import { Component, OnInit } from '@angular/core';
import { Paths } from '@core/models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public paths = Paths;

  constructor() { }

  ngOnInit(): void {}
}
