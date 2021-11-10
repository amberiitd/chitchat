export interface User{
    publicUsername: string;
    firstName: string;
    lastName: string;
    dp: Blob;
}

export const defaultUser: User = {
    publicUsername : "",
    firstName : "",
    lastName :"",
    dp: new Blob()
}