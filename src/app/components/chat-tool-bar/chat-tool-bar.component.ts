import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chat-tool-bar',
  templateUrl: './chat-tool-bar.component.html',
  styleUrls: ['./chat-tool-bar.component.css']
})
export class ChatToolBarComponent implements OnInit {

  @Input()
  public dp: Blob = new Blob();
  
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
