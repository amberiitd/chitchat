import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { defaultInMessage, InMessage } from 'src/app/model/message.model';
import { People } from 'src/app/model/people.model';
import { MessageService } from 'src/app/service/message.service';
import { TogglerService } from 'src/app/service/toggler.service';
import { formatTime } from 'src/app/util/util-method';

@Component({
  selector: 'app-messagelet',
  templateUrl: './messagelet.component.html',
  styleUrls: ['./messagelet.component.css']
})
export class MessageletComponent implements OnInit, OnChanges {
  @Input()
  public text: string="";

  @Input()
  public timestamp: number= 0;

  @Input()
  public from: string ="";

  @Input()
  public toRight= true;

  @Input()
  public viewed = false;

  @Input()
  public parentId: number |undefined;

  @Input()
  public convUser: People;

  @Output()
  public lookParent= new EventEmitter<any>();

  public formattedTime: string ="00:00";

  public horizontalAlign = 'left';

  public parentMessage: InMessage;

  public parentSender: string;

  constructor(
    private readonly messageService: MessageService,
    private readonly togglerService: TogglerService
  ) { }
  
  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['from'] && changes['from'].firstChange){

    }

    if(changes['timestamp']){
      this.formattedTime = formatTime(changes['timestamp'].currentValue);
    }

    if(changes['parentId'] && changes['parentId'].currentValue > 0){
      
      this.messageService.getMsgs(
        {
          from: this.from,
          startTime: this.parentId,
          count: 1
        },
        (data: InMessage[]) =>{
          if(data.length > 0){
            this.parentMessage = data[0];
            if(this.parentMessage.from === this.convUser.publicUsername){
              this.parentSender = this.convUser.nickName;
            }else{
              this.parentSender ="You";
            }

            this.togglerService.scrollBottom.next();
          }
        }
      )
    }
    
  }

  searchParentMessage(){
    this.lookParent.emit(this.parentMessage.timestamp);
  }

}
 

