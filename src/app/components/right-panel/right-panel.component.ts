import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InMessage } from 'src/app/model/message.model';
import { People } from 'src/app/model/people.model';
import { MessageService } from 'src/app/service/message.service';
import { TogglerService } from 'src/app/service/toggler.service';
import { formatTime } from 'src/app/util/util-method';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css']
})
export class RightPanelComponent implements OnInit {

  @Input()
  public selectedConv: People;

  @Input()
  public viewType: any= 'searchChat';

  @Output()
  public onSearchedMsgSelect = new EventEmitter<number>();

  public msgSearchResult: Array<InMessage> =[];
  public formatTime = formatTime;

  constructor(
    private readonly messageService: MessageService,
    public readonly togglerService: TogglerService
  ) { }

  ngOnInit(): void {
  }

  onMessageSearch(text: string){

    var lastText: any;
    const timerCallBack = () =>{
      if( lastText === text){
        this.messageService.getMsgs(
          {from: this.selectedConv.publicUsername, searchText: text}, 
          (data: any) => {
            this.msgSearchResult = data;
          }  
        )
      }else{
        lastText = text;
        setTimeout(timerCallBack, 1000);
      }
    };

    if(text === ''){
      this.msgSearchResult = [];
    }else{
      lastText = text;
      setTimeout(timerCallBack, 1000);
    }
  }

}
