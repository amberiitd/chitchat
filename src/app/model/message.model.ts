import { IMessage } from "@stomp/stompjs";

export interface OutMessage extends InMessage{
    to: string;
}

export interface InMessage{
    from: string;
    text: string;
    timestamp: string;
}