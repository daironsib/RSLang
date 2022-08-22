import { Component, OnInit } from '@angular/core';
import { Paths } from '@core/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public paths = Paths;

  constructor() { }

  ngOnInit(): void {}
}
