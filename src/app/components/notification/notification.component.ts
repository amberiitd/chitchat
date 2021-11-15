import { Component, OnInit } from '@angular/core';
import { UINotification } from 'src/app/model/notification.model';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  public notifications : any[] =[];

  constructor(
    private notifService: NotificationService
  ) { }

  ngOnInit(): void {
    this.notifService.notificationSubject.subscribe(
      notif => {
        this.notifications.splice(0, 0, {
          text: this.getFormatedText(notif),
          undo: notif.undo
        })

        setTimeout(
          () => {
            this.notifications.pop(); // splice(this.notifications.length-1, 1);
          },
          3000
        )
      }
    )
  }

  private getFormatedText(notif: UINotification) {
    var text ="";
    return notif.targetCount + ' ' + notif.target+ ' ' + notif.actionname;
  }

}
