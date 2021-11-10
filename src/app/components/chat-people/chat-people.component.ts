import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { defaultInMessage, InMessage } from 'src/app/model/message.model';
import { AuthService } from 'src/app/service/auth.service';
import { formatTime } from 'src/app/util/util-method';

@Component({
  selector: 'app-chat-people',
  templateUrl: './chat-people.component.html',
  styleUrls: ['./chat-people.component.css']
})
export class ChatPeopleComponent implements OnInit, OnChanges {
  @Input()
  public id: string= "NullString";

  @Input()
  public name: string= "NullString";

  @Input()
  public lastMessage: InMessage = defaultInMessage;

  @Input()
  public unseenCount: number = 0;

  @Input()
  public dp: Blob = new Blob();

  @Input()
  public viewType: 'conv' | 'contact' = 'conv';

  @Input()
  public status: string = "";

  @Output()
  public onSelect = new EventEmitter<string>();

  public lastMsgtime: string ="00:00";

  public dpString: any= "";

  constructor(
    public readonly authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.lastMessage){
      this.lastMsgtime = formatTime(this.lastMessage.timestamp);
    }
  }

  public onClickHandler(){
    this.onSelect.emit(this.id);
  }
}
