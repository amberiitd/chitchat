import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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

  public formattedTime: string ="00:00";

  public horizontalAlign = 'left';

  constructor() { }
  
  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formattedTime = formatTime(changes['timestamp'].currentValue);
    
  }

}
 

