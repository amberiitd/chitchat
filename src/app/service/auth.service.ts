import { Injectable } from "@angular/core";

@Injectable()
export class AuthService{

    public getAuthToken(){
        const username = "azra";
        const password = "amber1940";

        return btoa(username+":"+password);
    }
}