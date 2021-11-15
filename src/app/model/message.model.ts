
export interface OutMessage extends InMessage{
    to: string;
}

export interface InMessage{
    type: 'message' | 'typing' | 'viewNotif';
    from: string;
    text: string;
    notViewed: boolean;
    deleted: boolean;
    starred: boolean,
    timestamp: number;
    parentId?: number;
    parent?: InMessage; // timestamp for now 
}

export interface Notification{
    type: "msg_seen" | "";
    from: string;
    to: string;
    endTime: number;
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
    deleted: false,
    starred: false,
    timestamp: 0,
}
