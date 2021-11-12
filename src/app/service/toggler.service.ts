import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class TogglerService{
    public showRightPanel: boolean = false;
    public rightPaneltarget = "rightPanel";

    public scrollBottom = new Subject();
}