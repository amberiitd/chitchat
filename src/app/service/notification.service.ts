import { Inject, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { UIAlert, UINotification } from "../model/notification.model";

@Injectable()
export class NotificationService{
    public notificationSubject = new Subject<UINotification>();
    public alertSubject = new Subject<UIAlert>();
} 