import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from 'rxjs/operators'
import { People } from "../model/people.model";
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

}