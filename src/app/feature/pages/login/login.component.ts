import { Component, OnInit } from '@angular/core';
import { LoginFormModel, Paths } from '@core/models';
import { ApiService } from '@core/services/api.service';
import { TokenStorageService } from '@core/services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public paths = Paths;
  public form: LoginFormModel = {
    email: null,
    password: null
  };
  public isLoggedIn: boolean = false;
  public isLoginFailed: boolean = false;
  public errorMessage: string = '';

  constructor(private api: ApiService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.redirectOnHome();
    }
  }

  onSubmit(): void {
    const { email, password } = this.form;

    this.api.login(String(email), String(password)).subscribe(
      data => {
        const { token } = data;

        if (token) {
          this.tokenStorage.saveToken(token);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          
          this.redirectOnHome();
        }
      },
      err => {
        this.errorMessage = err.error;
        this.isLoginFailed = true;
      }
    );
  }

  private redirectOnHome(): void {
    setTimeout(() => {
      this.router.navigate([this.paths.Home]);
    }, 3000);
  }
}
