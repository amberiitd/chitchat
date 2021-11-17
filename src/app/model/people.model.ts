import { defaultInMessage, InMessage } from "./message.model";

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
    pinned: number;
}

export const defaultPeople: People = {
    init: false,
    messages: [],
    publicUsername: "string",
    nickName: "string",
    dp: new Blob(),
    lastMessage: defaultInMessage,
    unseenCount: 0,
    notViewedCount: 0,
    status: "string",
    pinned: -1
}
