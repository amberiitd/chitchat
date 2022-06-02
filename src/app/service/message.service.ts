import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { isEmpty, map } from 'lodash';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { ActionRequest } from '../model/action.model';
import { InMessage, MessageQuery, Notification, OutMessage } from '../model/message.model';
import { People } from '../model/people.model';
import { AuthService } from './auth.service';

@Injectable()
export class MessageService {

    public isConnected = false;
    private api = environment.profiles.find(profile => profile.name === environment.activeProfile)?.api;
    private stompClient: CompatClient;
    private messageBuffer: Array<OutMessage> = [];
    private sendingMsg: OutMessage;
    private sendingTimer: any;


    public nextMessageSubject = new Subject<InMessage>();

    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService
    ){}

    connect(
        onSuccess: (data : any) => void,
        onDisconnect: (data: any) => void,
        subscriptionCallback: (data: any) => void
        ){
        const socket = new SockJS(this.api+ "/chit-chat");
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
                const msg= JSON.parse(message.body) as InMessage;
                if (msg.type === 'msg_sent'){
                    const msgOnTop = this.messageBuffer.pop();
                    if(msgOnTop && msgOnTop.timestamp === msg.timestamp){
                        msgOnTop.status = 'sent';
                    }else if(msgOnTop){
                        this.messageBuffer.push(msgOnTop);
                    }

                    if(this.messageBuffer.length > 0){
                        this.send(this.messageBuffer[this.messageBuffer.length -1])
                    }
                }else {
                    subscriptionCallback(msg);
                }
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
        if(msg.type == 'message'){
            clearTimeout(this.sendingTimer);
            this.sendingMsg = msg;
            this.sendingTimer = setTimeout(
                ()=> {
                    if (this.messageBuffer.length > 0 && 
                        this.sendingMsg.timestamp === this.messageBuffer[this.messageBuffer.length -1].timestamp && this.sendingMsg.poll < 3){
                        this.sendingMsg.poll+=1;
                        this.send(this.sendingMsg)
                    }
    
                    return;
                },
                5000
            );
        }
        
        this.stompClient.send(`/app/monocast`, {}, JSON.stringify(msg));

    }

    sendToUser( msg: OutMessage){
        if (msg.type === 'message'){
            this.messageBuffer.splice(0, 0, msg);
            if (this.messageBuffer.length == 1){
                this.send(this.messageBuffer[0]);
            }
        }else{
            this.send(msg);
        }
        
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
            res= map(res, (msg)=> {
                msg.status ="sent";
                return msg;
            });
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

    updateMessage(action: ActionRequest, callBack: () => void) {
        const options = {
            headers : {
                'Authorization': 'Basic '+ this.authService.getAuthToken()
            }
        }
        this.http.post(this.api +"/msg-action", action, options)
        .pipe(
            catchError(error =>{
                console.log(error);
                return throwError(error);
            })
        )
        .subscribe( res =>{callBack()});
    }
  
} 