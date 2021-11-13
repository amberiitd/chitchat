import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from 'rxjs/operators'
import { People } from "../model/people.model";
import { User } from "../model/User.model";
import { AuthService } from "./auth.service";

@Injectable()
export class DataService{

    private api: string = "http://localhost:8080";

    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService
    ){}

    public getConversations(callBack: any){

        const options= {
            headers: {
                'Authorization': "Basic "+ this.authService.getAuthToken()
            }
        }
        this.http.get<Array<People>>(this.api + "/conversations", options)
        .pipe(
            catchError(
                (error: any) => {
                    console.log(error);
                    return throwError(error)
                }
            )
        )
        .subscribe(
            res => {callBack(res)}
        );
    }

    public getContacts(callBack: any){

        const options= {
            headers: {
                'Authorization': "Basic "+ this.authService.getAuthToken()
            }
        }
        this.http.get<Array<People>>(this.api + "/contacts", options)
        .pipe(
            catchError(
                (error: any) => {
                    console.log(error);
                    return throwError(error)
                }
            )
        )
        .subscribe(
            res => {callBack(res)}
        );
    }

    
    saveConv(publicUsername: string, callBack: () => void) {
        const options= {
            headers: {
                'Authorization': "Basic "+ this.authService.getAuthToken()
            },
            params: {
                'publicUsername': publicUsername
            }
        }
        this.http.post<any>(this.api + "/add-conv", {}, options)
        .pipe(
            catchError(
                (error: any) => {
                    console.log(error);
                    return throwError(error)
                }
            )
        )
        .subscribe(
            res => {callBack()}
        );
    }

    getNotifSound( callBack: any){
        const options= {
            headers: {
                'Authorization': "Basic "+ this.authService.getAuthToken(),
            },
            responseType: 'blob' as 'json'
        }
        this.http.get<Blob>(this.api + "/notif-sound", options)
        .pipe(
            // catchError(
            //     (error: any) => {
            //         console.log(error);
            //         return throwError(error)
            //     }
            // )
        )
        .subscribe( 
            data => {
                callBack(data);
            }
        )
    }
}