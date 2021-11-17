import { Component, OnInit } from '@angular/core';
import { isEmpty } from 'lodash';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  public firstName: string ="";
  public lastName: string="";
  public username: string ="";
  public publicUsername: string ="";

  public password1: string ="";
  public password2: string ="";

  public view = 1;

  public msg : string =""


  constructor(
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  submitLogin(){
    if(this.view === 1){
      this.authService.login(this.username, this.password1,
        data =>{
          this.msg = data.msg;
        }  
      );
    }else{
      this.verifyAndSignup();
    }
    
  }

  private verifyAndSignup(){
    if(isEmpty(this.firstName.trim())
      || isEmpty(this.lastName.trim()) 
    ){
      this.msg = "first name or last name cannit be blank";
      return;
    }
    if (this.password1 !== this.password2
      || isEmpty(this.password1.trim()) || isEmpty(this.password2.trim())){
        this.msg = "password is empty or did not match";
        return;
    }

    this.authService.userExist(this.username, this.publicUsername, 
      (data: any) => {
        if(data.principal === 'false'){
          this.authService.signup({
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.username,
            publicUsername: this.publicUsername,
            password: this.password1
          },
          (data)=>{
            this.msg ="successfully signed up";
            this.view = 1;
          })
        }else{
          this.msg ="user exist with this username"
        }
      }
      )
  }

}
