import { Injectable } from "@angular/core";

@Injectable()
export class TogglerService{
    public showRightPanel: boolean = false;
    public rightPaneltarget = "rightPanel";
}