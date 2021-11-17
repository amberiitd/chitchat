import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Action } from 'src/app/model/action.model';

@Component({
  selector: 'app-chat-tool-bar',
  templateUrl: './chat-tool-bar.component.html',
  styleUrls: ['./chat-tool-bar.component.css']
})
export class ChatToolBarComponent implements OnInit {

  @Input()
  public dp: Blob = new Blob();

  @Input()
  public actions: ReadonlyArray<Action> =[];
  
  @Output()
  public showContacts = new EventEmitter<any>();

  @Output()
  public showProfile = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  toggleFirstColumn(){
    this.showContacts.emit({})
  }
}
