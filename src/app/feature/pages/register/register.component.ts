import { Component, OnInit } from '@angular/core';
import { Paths, RegisterFormModel } from '@core/models';
import { ApiService } from '@core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public form: RegisterFormModel = {
    name: null,
    email: null,
    password: null
  };
  public isSuccessful: boolean = false;
  public isSignUpFailed: boolean = false;
  public errorMessage: string = '';
  public paths = Paths;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const { name, email, password } = this.form;
    this.api.register(String(name), String(email), String(password)).subscribe(
      data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;

        setTimeout(() => {
          this.router.navigate([this.paths.Login]);
        }, 3000);
      },
      err => {
        this.errorMessage = err.error.error.errors[0].message;
        this.isSignUpFailed = true;
      }
    );
  }
}
