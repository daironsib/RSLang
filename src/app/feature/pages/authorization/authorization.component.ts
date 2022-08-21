import { Component, OnInit } from '@angular/core';
import { Paths } from '@core/models';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {
  public paths = Paths;

  constructor() { }

  ngOnInit(): void { }
}
