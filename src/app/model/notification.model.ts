export interface UINotification{
    actionname: string;
    target: 'message' | 'chat'| 'contact';
    targetCount?: number;
    targetData?: any; 
    undo?: () => void; 
    
}

export interface UIAlert{
    actionName: string;
    target: 'message' | 'chat' ;
    fallback: () => void,
    options: Array<{name: string, call: () => void}>;
    targetCount?: number;

}