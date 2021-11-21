import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from 'rxjs/operators'
import { environment } from "src/environments/environment";
import { People, PeopleDTO } from "../model/people.model";
import { User } from "../model/User.model";
import { AuthService } from "./auth.service";

@Injectable()
export class DataService{

    private api = environment.profiles.find(profile => profile.name === environment.activeProfile)?.api;


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
        this.http.get<Array<PeopleDTO>>(this.api + "/contacts", options)
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

    
    findPeople(publicUsername: string, callback: (data: PeopleDTO) => void) {
        const options= {
            headers: {
                'Authorization': "Basic "+ this.authService.getAuthToken()
            },
            params: {
                'publicUsername': publicUsername,
            }
        }
        this.http.get<PeopleDTO>(this.api + "/people", options)
        .pipe(
            catchError(
                (error: any) => {
                    console.log(error);
                    return throwError(error)
                }
            )
        )
        .subscribe(
            res => {callback(res)}
        );
    }

    
    addContact(publicUsername: string, nickName: string, callback: () => void) {
        const options= {
            headers: {
                'Authorization': "Basic "+ this.authService.getAuthToken()
            },
            params: {
                publicUsername: publicUsername,
                nickName: nickName
            }
        }
        this.http.post<PeopleDTO>(this.api + "/add-contact", {}, options)
        .pipe(
            catchError(
                (error: any) => {
                    console.log(error);
                    return throwError(error)
                }
            )
        )
        .subscribe(
            res => {callback()}
        );   
    }

    
    deleteTarget(data: {publicUsername: string, targetType: any}, callback: () => void) {
        const options= {
            headers: {
                'Authorization': "Basic "+ this.authService.getAuthToken()
            }
        }
        this.http.post<any>(this.api + "/delete", data, options)
        .pipe(
            catchError(
                (error: any) => {
                    console.log(error);
                    return throwError(error)
                }
            )
        )
        .subscribe(
            res => {callback()}
        );   
    }

    
    updatePinned(publicUsername: string, value: number, callback: () => void) {
        const options= {
            headers: {
                'Authorization': "Basic "+ this.authService.getAuthToken()
            },
            params: {
                publicUsername: publicUsername,
                stamp: value
            }
        }
        this.http.post<any>(this.api + "/pin-conv", {}, options)
        .pipe(
            catchError(
                (error: any) => {
                    console.log(error);
                    return throwError(error)
                }
            )
        )
        .subscribe(
            res => {callback()}
        );   
    }
}