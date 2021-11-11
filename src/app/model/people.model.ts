import { InMessage } from "./message.model";

export interface People extends PeopleDTO{
    init: boolean;
    messages: Array<InMessage>;
    style?: {bg: string};
}

export interface PeopleDTO{
    publicUsername: string;
    nickName: string;
    dp: Blob;
    lastMessage: InMessage;
    unseenCount: number;
    notViewedCount: number;
    status: string;
}
