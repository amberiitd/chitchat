export interface Action{
    idx: number;
    name: string;
    callback: (data: any) => void;
}

export interface ActionRequest {
    name: string;
    timestamps : Array<number>;
}