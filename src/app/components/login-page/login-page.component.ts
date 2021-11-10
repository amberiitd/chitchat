import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  public username: string ="";
  public password: string ="";
  public msg : string =""


  constructor(
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  submitLogin(){
    this.authService.login(this.username, this.password,
      data =>{
        this.msg = data;
      }  
    );
  }

}
