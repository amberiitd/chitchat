import { IMessage } from "@stomp/stompjs";

export interface OutMessage extends InMessage{
    to: string;
}

export interface InMessage{
    from: string;
    text: string;
    timestamp: number;
}

export interface Notification{
    type: "msg_seen" | "";
    from: string;
    to: string;
}

export interface MessageQuery{
    from: string;
    searchText?: string;
    count?: number;
    offset?: number;
    startTime?: number;
    endTime?: number;
    pivotTime?: number;
}

export const defaultInMessage: InMessage = {
    from: "",
    text: "",
    timestamp: 0,
}
