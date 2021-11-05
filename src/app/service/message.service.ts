import { Injectable } from '@angular/core';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { InMessage, OutMessage } from '../model/message.model';

@Injectable()
export class MessageService {

    private stompClient: CompatClient;

    public nextMessageSubject = new Subject<InMessage>();

    connect(username: string){
        const socket = new SockJS("http://localhost:8080/chit-chat");
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({'username': username}, (frame: any) =>{
            console.log('Connected: ' + frame);
            console.log('URL: '+ this.stompClient.ws._transport.url);
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
        })
    }

    disconnect(){
        if(this.stompClient){
            this.stompClient.disconnect();
        }
        console.log('disconnected')
    }

    send(msg: OutMessage){
        this.stompClient.send("/app/broadcast", {}, JSON.stringify(msg))
    }

    sendToUser(userId: string, msg: OutMessage){
        this.stompClient.send(`/app/monocast`, {'username': userId}, JSON.stringify(msg))
    }

} 