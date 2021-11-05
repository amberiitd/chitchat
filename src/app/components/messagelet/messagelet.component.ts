import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-messagelet',
  templateUrl: './messagelet.component.html',
  styleUrls: ['./messagelet.component.css']
})
export class MessageletComponent implements OnInit, OnChanges {
  @Input()
  public text: string;

  @Input()
  public time: string;

  @Input()
  public from: string;

  public horizontalAlign = 'left';

  constructor() { }
  
  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const from = changes['from'];
    
  }

}
