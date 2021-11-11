import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { isEmpty } from 'lodash';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import { InMessage, MessageQuery, Notification, OutMessage } from '../model/message.model';
import { AuthService } from './auth.service';

@Injectable()
export class MessageService {

    public isConnected = false;
    private api = "http://localhost:8080";
    private stompClient: CompatClient;

    public nextMessageSubject = new Subject<InMessage>();

    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService
    ){}

    connect(
        onSuccess: (data : any) => void,
        onDisconnect: (data: any) => void,
        ){
        const socket = new SockJS("http://localhost:8080/chit-chat");
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({'Authorization': 'Basic '+ this.authService.getAuthToken()}, (frame: any) =>{

            var url = this.stompClient.ws._transport.url as string;
            url = url.substring(0, url.lastIndexOf('/'))
            const userSession= url.substring(url.lastIndexOf('/')+1); 

            console.log('userSession: '+ userSession);

            this.stompClient.subscribe('/topic/msg', (message)=> {
                console.log(message);
                this.nextMessageSubject.next(JSON.parse(message.body) as InMessage);
            });

            this.stompClient.subscribe('/user/queue/msg', (message)=> {
                console.log(message);
                this.nextMessageSubject.next(JSON.parse(message.body) as InMessage);
            });

            this.isConnected = true;
            onSuccess({});
        })
        this.stompClient.onDisconnect = frame =>{
            this.isConnected = false;
            onDisconnect({});
        }
    }

    disconnect(){
        if(this.isConnected){
            this.stompClient.disconnect();
        }
        console.log('disconnected')
    }

    send(msg: OutMessage){
        console.log(msg)
        this.stompClient.send("/app/broadcast", {}, JSON.stringify(msg))
    }

    sendToUser( msg: OutMessage){
        this.stompClient.send(`/app/monocast`, {}, JSON.stringify(msg))
    }

    getMsgs(query: MessageQuery, callBack: (msgs: InMessage[]) => void) {
        const options = {
            headers : {
                'Authorization': 'Basic '+ this.authService.getAuthToken()
            }
        }
        this.http.post<Array<InMessage>>(this.api +"/msgs",query, options)
        .pipe(
            catchError(error =>{
                console.log(error);
                return throwError(error);
            })
        )
        .subscribe( res =>{
            callBack(res);
        })
    }

    notify(notif: Notification){
        const options = {
            headers : {
                'Authorization': 'Basic '+ this.authService.getAuthToken()
            }
        }
        this.http.post(this.api +"/notif", notif, options)
        .pipe(
            catchError(error =>{
                console.log(error);
                return throwError(error);
            })
        )
        .subscribe( res =>{});
    }
  
} 