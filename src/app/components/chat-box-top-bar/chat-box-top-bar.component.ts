import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Action } from 'src/app/model/action.model';
import { TogglerService } from 'src/app/service/toggler.service';

@Component({
  selector: 'app-chat-box-top-bar',
  templateUrl: './chat-box-top-bar.component.html',
  styleUrls: ['./chat-box-top-bar.component.css']
})
export class ChatBoxTopBarComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('profile') private profile: ElementRef;
  @ViewChild('search') private search: ElementRef;


  @Input()
  public id: string= "NullString";

  @Input()
  public name: string= "NullString";

  @Input()
  public isTyping =false;

  @Input()
  public dp: Blob = new Blob();

  @Input()
  public actions : ReadonlyArray<Action> =[];

  @Output()
  public rightPanelView = new EventEmitter();

  constructor(
    public readonly togglerService: TogglerService
  ) { }

  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {
    if(this.profile){
      // this.profile.nativeElement.addEventListener('hide.bs.collapse', function (e: any) {
      //   e.preventDefault();
      // });
  
      
    }
    console.log(this.search);
  }
  

  
  ngAfterViewChecked(): void {
  }

  toggler(view: any){
    this.rightPanelView.emit(view);
    if(this.togglerService.showRightPanel){
      // e.preventDefault();
    }else{
      this.togglerService.showRightPanel = true;
      this.togglerService.rightPaneltarget ="";
    }  
  }

}
