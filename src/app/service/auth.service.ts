import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { defaultUser, User } from "../model/User.model";

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
        // const index = this.users.findIndex(user => user.username === username && user.password === password);
        const options = {
            headers: {
                'Authorization': 'Basic '+ btoa(username+":"+password)
            },
            responseType: "text" as 'json'
        }
        this.http.get<any>(this.api+ "/login", options)
        .pipe(
            catchError(e =>{
                console.log(e);
                if(callBack){
                    callBack({msg: "Http Error"});
                }
                return throwError(e);
            })
        )
        .subscribe(principal => {
            if(principal){
                this.token = btoa(username+":"+password);
                this.isAuthenticated = true;
                this.authSubject.next({});
                sessionStorage.setItem('authToken', this.token);
            }else{
                if(callBack){
                    callBack({msg: "Could not Authorize"});
                }
            }
            
        });

        // if (index >=0){
        //     this.token = btoa(username+":"+password);
        //     this.isAuthenticated = true;
        //     this.authSubject.next({});
        //     sessionStorage.setItem('authToken', this.token);
        // }
        // if(callBack)
        //     callBack("Could not Authorize");
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

    
    signup(data: { firstName: string; lastName: string; username: string; publicUsername: string; password: string; }, callback: (data: any)=> void) {
        this.http.post<any>(this.api+ "/signup", data, {})
        .pipe(
            catchError(e =>{
                console.log(e);
                if(callback){
                    callback({msg:"Http Error"});
                }
                return throwError(e);
            })
        )
        .subscribe(res => {
            callback({})
        });
    }
    userExist(username: string, publicUsername: string, callback: (data: any) => void) {
        const options = {
            params: {
                'username': username,
                'publicUsername': publicUsername,
            },
            responseType: "text" as 'json'
        }
        this.http.get<any>(this.api+ "/check-exist", options)
        .pipe(
            catchError(e =>{
                console.log(e);
                if(callback){
                    callback({msg: "Http Error"});
                }
                return throwError(e);
            })
        )
        .subscribe(principal => {
            callback({principal: principal, msg: ""})
        });
    }

    logout(callback: () => void) {
        sessionStorage.clear();
        this.currentUser = defaultUser;
        this.isAuthenticated =false;

        console.log('user logged out');
        callback();
    }
}