import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Action } from 'src/app/model/action.model';
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
  public deleted = false;

  @Input()
  public starred = false;

  @Input()
  public status : any;

  @Input()
  public parent: InMessage | undefined;

  @Input()
  public convUser: People;

  @Input()
  public actions: ReadonlyArray<Action> = [];

  @Output()
  public lookParent= new EventEmitter<any>();

  public formattedTime: string ="00:00";

  public horizontalAlign = 'left';

  public parentSender: string;

  public bgColor = "inherit";

  public showDropDown = false;

  constructor(
    private readonly togglerService: TogglerService
  ) { }
  
  ngOnInit(): void {
    this.togglerService.pingMessagelet.subscribe(
      data =>{
        if (data === this.timestamp){
          this.highLight();
        }
      }
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['toRight'] ){
      this.resetBg();
    }

    if(changes['timestamp']){
      this.formattedTime = formatTime(changes['timestamp'].currentValue);
    }

    if(changes['parent'] && this.parent){
      if(this.parent.from === this.convUser.publicUsername){
        this.parentSender = this.convUser.nickName;
      }else{
        this.parentSender ="You";
      }
      
    }
    
  }

  searchParentMessage(){
    if (this.parent){
      this.lookParent.emit(this.parent.timestamp);
    }
  }

  private highLight(){

    this.bgColor = '#adb5bd';

    setTimeout(() =>{
      this.resetBg()
    }, 1000)
  }

  private resetBg(){
    if( this.toRight){
      this.bgColor = '#b0f7f7';
    }else{
      this.bgColor = '#fff';
    }
  }

  hoverOnBody(){
    this.showDropDown = true;
  }

  hoverOffBody(){
    this.showDropDown = false;

  }

}
 

