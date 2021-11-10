import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-box-top-bar',
  templateUrl: './chat-box-top-bar.component.html',
  styleUrls: ['./chat-box-top-bar.component.css']
})
export class ChatBoxTopBarComponent implements OnInit {

  @Input()
  public id: string= "NullString";

  @Input()
  public name: string= "NullString";

  @Input()
  public dp: Blob = new Blob();

  constructor() { }

  ngOnInit(): void {
  }

}
