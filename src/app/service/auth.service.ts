import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "../model/User.model";

@Injectable()
export class AuthService{
    public isAuthenticated = false;
    public authSubject = new Subject<any>();
    public currentUser : User;

    private api = "http://localhost:8080"
    private token: any ="";
    private users: any[] =[
        {
            username: "azra",
            password: "amber1940"
        },
        {
            username: "namber",
            password: "amber1940"
        }
    ]

    constructor(
        private readonly http: HttpClient
    ){
        this.token = sessionStorage.getItem('authToken');
        if (this.token){
            this.isAuthenticated = true;
        }
    }
    

    public getAuthToken(){
        return this.token;
    }
    
    login(username: string, password: string, callBack?: (data: any) => void) {
        const index = this.users.findIndex(user => user.username === username && user.password === password);

        if (index >=0){
            this.token = btoa(username+":"+password);
            this.isAuthenticated = true;
            this.authSubject.next({});
            sessionStorage.setItem('authToken', this.token);
        }
        if(callBack)
            callBack("Could not Authorize");
    }

    getCurrentUser(callBack: (user: any) => void) {
        const options = {
            headers: {
                'Authorization': 'Basic '+ this.getAuthToken()
            }
        }
        this.http.get<User>(this.api+ "/user", options)
        .subscribe(
            res => {
                this.currentUser = res;
                callBack(res);
            }
        )
    }
}