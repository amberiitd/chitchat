import { Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  @Input()
  public placeholder : string ="";

  @Output()
  public onTextChange = new EventEmitter<any>();

  public searchString: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  onChangeHandler(newVal: any){
    this.onTextChange.emit(newVal)
  }

}
