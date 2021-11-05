import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-chat-people',
  templateUrl: './chat-people.component.html',
  styleUrls: ['./chat-people.component.css']
})
export class ChatPeopleComponent implements OnInit, OnChanges {

  @Input()
  public name: string= "NullString";

  @Input()
  public dp: Blob = new Blob();

  @Output()
  public onSelect = new EventEmitter<string>();

  public dpString: any= "";

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dp'].isFirstChange()){
      // const reader = new FileReader();
      // reader.readAsDataURL(this.dp);
      // reader.onload= (e) => {
      //   this.dpString = e.target?.result;
      // };
    }
  }

  public onClickHandler(){
    this.onSelect.emit(this.name);
  }
}
