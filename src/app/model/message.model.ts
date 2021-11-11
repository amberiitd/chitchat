import { IMessage } from "@stomp/stompjs";

export interface OutMessage extends InMessage{
    to: string;
}

export interface InMessage{
    type: 'message' | 'typing' | 'viewNotif';
    from: string;
    text: string;
    notViewed: boolean;
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
    type: "message",
    from: "",
    text: "",
    notViewed: false,
    timestamp: 0,
}
