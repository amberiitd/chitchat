import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { isEmpty } from 'lodash';
import { BsModalService } from 'ngx-bootstrap/modal';
import { throwError } from 'rxjs';
import { timestamp } from 'rxjs/operators';
import { Action, ActionRequest } from 'src/app/model/action.model';
import { UIAlert } from 'src/app/model/notification.model';
import { defaultUser, User } from 'src/app/model/User.model';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';
import { NotificationService } from 'src/app/service/notification.service';
import { TogglerService } from 'src/app/service/toggler.service';
import { formatTime } from 'src/app/util/util-method';
import { OutMessage, InMessage, defaultInMessage } from '../../model/message.model';
import { defaultPeople, People, PeopleDTO } from '../../model/people.model';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewChecked, AfterViewInit {
  @ViewChild('scrollToEnd') private myScrollContainer: ElementRef;
  @ViewChild('rightPanel') private rightPanel: ElementRef;
  @ViewChild('alertModal')
  public alertModal: TemplateRef<any>;

  @ViewChild('newContactModal')
  public newContactModal: TemplateRef<any>;

  public alert: UIAlert;


  public messageletActions : Array<Action> =[];
  public convActions: Array<Action> = [];
  public chatToolBarActions: Array<Action> = [];
  public chatBoxTopBarActions: Array<Action> = [];

  public currentUser: User = defaultUser;
  public msgList: Array<InMessage>= [];
  public newmsg: string = "";
  public defaultScrollDown = true;

  public peopleList: Array<People> =[];
  public searchedConvList: Array<People> =[];
  public sound: {
    bytes: Blob;
    audioCtx: AudioContext;
    audioBuffer: AudioBuffer | undefined;

  }

  public selectedConv: any;
  public connectionStatus: 'disconnected' | 'connected' | 'loading' = 'loading';
  public firstColumn: 'conv' | 'contact'= 'conv';
  public contacts: Array<PeopleDTO> = [];
  public searchedContacts: Array<PeopleDTO> = [];

  public messages: Array<InMessage> = [];
  public selectedMessageStamps: Array<number> =[];
  public msgSearchResult: Array<InMessage> = [];
  public rightPanelViewType: 'searchChat' | 'userPref' = 'searchChat';

  public replyToMessage: InMessage | undefined;
  public replyToPeople: string | undefined;
  public addchatBoxClass:"chat-window1" | "chat-window2"  = "chat-window1";

  public newContact: {
    showInput: boolean;
    publicUsername: string;
    nickName: string;
    fallback: () => void;
    add: ()=> void;
    result?: PeopleDTO;
  } = {
    showInput: false,
    publicUsername: "",
    nickName: "",
    fallback: ()=> {},
    add: () => {}
  };
  
  public formatTime = formatTime;

  constructor(
    private readonly messageService: MessageService,
    private readonly dataService: DataService,
    public readonly authService: AuthService,
    public readonly togglerService: TogglerService,
    public readonly notifService: NotificationService,
    public readonly modalService: BsModalService
  ) {   }
  

  ngOnInit(): void {
    
    this.init();
    this.authService.authSubject.subscribe(
      input =>{
        this.init();
      }
    )

    this.messageService.nextMessageSubject.subscribe(
      msg =>{
        this.msgList.push(msg);
      }
    )
  }

  ngAfterViewInit(): void {
    // this.rightPanel.nativeElement.addEventListener('hide.bs.collapse', (e: any) =>{
    //   e.preventDefault();
    // })
  }

  ngAfterViewChecked(): void {
    if( this.defaultScrollDown){
      this.defaultScrollDown = false;
      this.scrollToBottom();
    }
  }

  init(){
    // this.togglerService.scrollBottom.subscribe(
    //   () => {
    //     this.defaultScrollDown = true;
    //   }
    // )
    this.initActions();

    this.dataService.getNotifSound(
      async (data: Blob) => {

        this.sound= {
          bytes : data,
          audioCtx: new AudioContext(),
          audioBuffer: undefined
        }
        this.sound.audioCtx.decodeAudioData(await this.sound.bytes.arrayBuffer(), (input)=>{this.sound.audioBuffer = input});
         
      }
    )

    this.authService.getCurrentUser(
      user =>{
        this.currentUser = user;
        this.refreshConnection();
      }
    )
    

    this.messageService.nextMessageSubject.subscribe(
      msg =>{
        const index = this.peopleList.findIndex(conv => conv.publicUsername === msg.from );
        if (index < 0 && msg.type === 'message' ){
          this.dataService.findPeople(msg.from, 
            (data: PeopleDTO)=> {
              const people: People= data as People;
              people.messages =[msg];
              people.lastMessage =msg;
              people.unseenCount =1;
              this.peopleList.push(people);
              this.reOrderConv();
              this.playNotifSound();
            }
          );
        }
        if (index >= 0 ){

          switch (msg.type){
            case 'message':
              this.peopleList[index].lastMessage = msg;
              this.playNotifSound();
              
              if (this.peopleList[index].init){
                this.peopleList[index].messages.push(msg); // conv message always have last message if init= true
    
                if(this.selectedConv.publicUsername === this.peopleList[index].publicUsername
                  && this.messages[this.messages.length -1].timestamp === this.selectedConv.lastMessage.timestamp){
                  this.defaultScrollDown = true;

                  this.messageService.notify(
                    {
                      type: "msg_seen", 
                      from: this.selectedConv.publicUsername, 
                      to: this.currentUser.publicUsername,
                      endTime: this.messages[this.messages.length-1].timestamp
                    }
                  );
                }else{
                  this.peopleList[index].unseenCount +=1;
                }
              }else{
                this.peopleList[index].unseenCount +=1;
              }

              this.reOrderConv();
              
              break;

            case 'typing':
              if(this.selectedConv && this.selectedConv.publicUsername === this.peopleList[index].publicUsername){
                this.selectedConv.isTyping = true;
                setTimeout(()=>{this.selectedConv.isTyping = false}, 1990);
              }

              break;

            case 'viewNotif':
              if(this.selectedConv){
                // for ui live change 
                this.messages.slice(this.messages.length - this.selectedConv.notViewedCount).forEach(
                  msg =>{
                    msg.notViewed = false;
                  }
                )
              }else{
                this.peopleList[index].notViewedCount = 0;
              }
              

              break;

            default:
              break;
          }
          
        }

      }
    )
  }

  initActions(){
    this.messageletActions =   [
      {
        idx: 0,
        name: 'Reply',
        callback: (data) =>{
          this.replyTo(data);
        }
      },
      {
        idx: 1,
        name: 'Star Message',
        callback: (data) =>{
          this.pushToSelected(data);
          this.updateMessage("star");
        }
      },
      {
        idx: 2,
        name: 'Delete Message',
        callback: (data) =>{
          this.pushToSelected(data);
          this.updateMessage("delete");
        }
      },
    ];

    this.convActions = [
      {
        idx: 0,
        name: 'Delete Chat',
        callback: (data) =>{
          this.deleteAction({publicUsername: data, targetType: 'chat'});
        }
      },
      {
        idx: 1,
        name: 'Pin Chat',
        callback: (data) =>{
          const index = this.peopleList.findIndex(conv => conv.publicUsername == data);
          const conv = this.peopleList[index];
          if(conv.pinned > 0){
            conv.pinned = 0
          }else{
            conv.pinned = this.getTimeNow();
          }
          this.dataService.updatePinned(conv.publicUsername, conv.pinned,  () => {})
          this.reOrderConv();
        }
      },
      {
        idx: 2,
        name: 'Mark as read',
        callback: (data) =>{
          const index = this.peopleList.findIndex( conv => conv.publicUsername ==  data);
          const conv = this.peopleList[index];

          if(conv.unseenCount > 0){
            this.messageService.notify(
              {
                type: "msg_seen", 
                from: conv.publicUsername, 
                to: this.currentUser.publicUsername,
                endTime: conv.lastMessage.timestamp
              }
            );
            conv.unseenCount =0 ;
          }else{
            conv.unseenCount = 1;
          }
          
        }
      },
    ];

    this.chatToolBarActions =[
      {
        idx: 0,
        name: 'Log out',
        callback: (data) =>{
          this.authService.logout(()=>{
            this.currentUser = defaultUser;
            this.messages =[]
            this.peopleList =[]
            this.contacts =[]
            this.selectedConv = undefined;
          });
        }
      },
    ];

    this.chatBoxTopBarActions =[
      {
        idx: 0,
        name: 'Contact info',
        callback: (data) =>{
          
        }
      },
      {
        idx: 1,
        name: 'Select messages',
        callback: (data) =>{
          
        }
      },
      {
        idx: 2,
        name: 'Close chat',
        callback: (data) =>{
          this.removeConvSelectionProps();
        }
      },
      {
        idx: 3,
        name: 'Clear messages',
        callback: (data) =>{
          this.deleteAction({publicUsername: data, targetType: 'messages'});
        }
      },
      {
        idx: 5,
        name: 'Delete chat',
        callback: (data) =>{
          this.deleteAction({publicUsername: data, targetType: 'chat'});
        }
      },
    ];

    this.messageletActions.forEach(action =>{
      action.callback = action.callback.bind(this);
    })

    this.convActions.forEach(action =>{
      action.callback = action.callback.bind(this);
    })

    this.chatToolBarActions.forEach(action =>{
      action.callback = action.callback.bind(this);
    })
  }

  disconnect(){
    this.messageService.disconnect();
  }

  refreshConnection(){
    this.messageService.connect(
      input => {
        this.connectionStatus = 'connected';
        this.dataService.getConversations( (dtoList: Array<PeopleDTO>) =>{
          this.peopleList = [];
          dtoList.forEach(
            dto =>{
              const conv: People ={
                ...dto,
                init: false,
                messages: []
              };
    
              this.peopleList.push(conv);
              this.reOrderConv();
            }
          )
        });
      },
      input => {
        this.connectionStatus = 'disconnected';
      }
    );
  }

  sendToUser(data : {type: any, msgText?: string}){
    if (data.type == 'typing'){
      const outMsg: OutMessage = {
        ...defaultInMessage,
        type: "typing",
        to: this.selectedConv.publicUsername,
        from: this.currentUser.publicUsername
      }

      this.messageService.sendToUser(outMsg);
    }
    else if ((data.type === 'message' && data.msgText && !isEmpty(data.msgText.trim()))){
      const inMsg: InMessage = {
        ...defaultInMessage,
        type: 'message',
        from: this.currentUser.publicUsername,
        text: data.msgText?? "",
        notViewed: true,
        timestamp: this.getTimeNow()
      }

      if (this.replyToMessage){
        inMsg.parentId = this.replyToMessage.timestamp;
        inMsg.parent = this.replyToMessage
      }

      const outMsg: OutMessage ={
        ...inMsg,
        to: this.selectedConv.publicUsername
      }

      if(!this.selectedConv.messages){
        //add to conv 
        this.selectedConv.messages= []
        this.messages = this.selectedConv.messages;
        this.peopleList.splice(0, 0, this.selectedConv);
        this.dataService.saveConv(this.selectedConv.publicUsername, () =>{});
      }
      this.selectedConv.messages.push(inMsg);
      this.selectedConv.notViewedCount+=1;
      this.selectedConv.lastMessage = inMsg;
      this.messageService.sendToUser(outMsg);

      // reconnect to selected conv messages
      this.messages = this.selectedConv.messages
      this.reOrderConv();
      this.defaultScrollDown = true;

      this.newmsg = "";

      return;
    }
  }

  getTimeNow(){
    var currentdate = new Date(); 
     return currentdate.getTime();
    // return currentdate.getDate() + "/"
    //                 + (currentdate.getMonth()+1)  + "/" 
    //                 + currentdate.getFullYear() + " @ "  
    //                 + currentdate.getHours() + ":"  
    //                 + currentdate.getMinutes() + ":" 
    //                 + currentdate.getSeconds();
  }
  scrollHandler(event: any){
    if (this.myScrollContainer.nativeElement.scrollHeight === this.myScrollContainer.nativeElement.clientHeight + this.myScrollContainer.nativeElement.scrollTop){
      if ( this.messages[this.messages.length -1].timestamp < this.selectedConv.lastMessage.timestamp){
        this.messageService.getMsgs(
          {from: this.selectedConv.publicUsername, startTime: this.messages[this.messages.length-1].timestamp}, 
          (data: any[]) => {
            this.messages.push(...data.slice(1));
          }  
        )
      }else {
        this.messages = this.selectedConv.messages;

        if (this.selectedConv.unseenCount > 0){
          this.messageService.notify(
            {
              type: "msg_seen", 
              from: this.selectedConv.publicUsername, 
              to: this.currentUser.publicUsername,
              endTime: this.messages[this.messages.length-1].timestamp
            }
          );
          this.selectedConv.unseenCount = 0;
        }
        
      }
      
    }else if(this.myScrollContainer.nativeElement.scrollTop === 0){
      this.messageService.getMsgs(
        {from: this.selectedConv.publicUsername, endTime: this.messages[0].timestamp}, 
        (data: any) => {
          this.messages.splice(0, 0,...data); // so as not to disconnect selectedConv to messages
        }  
      )
    }

  }
  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight-this.myScrollContainer.nativeElement.clientHeight- 5;
    } catch(err) { }                 
  }

  onConvSelect(convId: string){
    console.log(convId);
    if (!this.selectedConv || this.selectedConv.publicUsername !== convId){
      if (this.selectedConv){
        this.removeConvSelectionProps();
      }
      this.selectedConv = this.peopleList.find(conv => conv.publicUsername === convId) as People;
      this.selectedConv.style = {bg: 'azure'};
      this.messages = this.selectedConv.messages;

      const postSelection = () => {

        if(this.selectedConv.lastMessage){
          this.messageService.notify(
            {
              type: "msg_seen", 
              from: this.selectedConv.publicUsername, 
              to: this.currentUser.publicUsername,
              endTime: this.selectedConv.lastMessage.timestamp
            }
          );
        }
        
        this.selectedConv.unseenCount = 0;
        this.defaultScrollDown = true;
      }

      if(!this.selectedConv.init){
        this.selectedConv.init = true;
        this.messageService.getMsgs( {from: this.selectedConv.publicUsername},
          (msgs: Array<InMessage>) =>{
            this.selectedConv.messages.push(...msgs);
            postSelection();
          }
        ); 
      }else{
        postSelection();
      }
    }
  }

  removeConvSelectionProps(){
    if(this.selectedConv){
      this.selectedConv.style= {bg: 'inherit'};
      this.selectedConv = undefined;
      this.messages = []
    }

  }

  onContactSelect(contactId: any){
    const index = this.peopleList.findIndex(conv => conv.publicUsername === contactId);
    if(index >=0){
      this.onConvSelect(contactId);
      return;
    }

    if (this.selectedConv){
      this.removeConvSelectionProps();
    }
    this.selectedConv = this.contacts.find(conv => conv.publicUsername === contactId) as People;
    this.selectedConv.style = {bg: 'azure'};
  }

  toggleFirstColumn(event: any){
    this.dataService.getContacts( (data: any) =>{
      this.contacts = data
      this.searchedContacts =this.contacts;
    });
  }

  toggleRightPanel(view: any){
    this.rightPanelViewType = view;
  }

  onContactSearch(text: string){
    if(text === ''){
      this.searchedContacts = this.contacts;
    }else{
      this.searchedContacts = this.contacts.filter(contact => contact.nickName.toLocaleLowerCase().includes(text.toLocaleLowerCase()))
    
    }
  }

  onConvSearch(text: string){
    if(text === ''){
      this.searchedContacts = [...this.contacts];
    }else{
      this.searchedContacts = this.contacts.filter(contact => contact.nickName.toLocaleLowerCase().includes(text.toLocaleLowerCase()))
    
    }
  }

  onSearchedMsgSelect(pivotTime: number){
    if(!this.selectedConv){
      return;
    }

    this.messageService.getMsgs(
      {from: this.selectedConv.publicUsername, pivotTime: pivotTime}, 
      (data: any) => {
        this.messages = data;// messages dosconnected from selected conv
        // this.selectedConv.messages.splice(0, this.messages.length, data); //do not implement this

        setTimeout(
          ()=> {this.togglerService.pingMessagelet.next(pivotTime);},
          500
        )
        
      }  
    )
  }

  replyTo(timestamp: number){
    const msg = this.messages.find(m => m.timestamp === timestamp);
    this.replyToMessage = msg;

    if (msg && msg.from === this.currentUser.publicUsername){
      this.replyToPeople = "You"
    }else{
      this.replyToPeople = this.selectedConv.nickName;
    }

    this.addchatBoxClass = 'chat-window2';
    this.defaultScrollDown = true;
  }

  cancelReply(event: any){
    this.replyToMessage = undefined;
    this.replyToPeople = undefined;
    this.addchatBoxClass ="chat-window1";
  }

  playNotifSound(){
    const audioSrc = this.sound.audioCtx.createBufferSource();
    audioSrc.connect(this.sound.audioCtx.destination);

    if(this.sound.audioBuffer){
      audioSrc.buffer = this.sound.audioBuffer;

      audioSrc.start();
    }
    
  }

  pushToSelected(timestamp: number){
    this.selectedMessageStamps.push(timestamp);    
  }

  updateMessage(actionName: string){
    const selectedCount = this.selectedMessageStamps.length;

    const commonCallback = (() =>{
      this.selectedMessageStamps.forEach(
        timestamp => {
          const index = this.messages.findIndex(m => m.timestamp === timestamp);
          if(index >=0){
            if(actionName === 'star'){
              this.messages[index].starred = !this.messages[index].starred;
              // this.messages.splice(index, 1, this.messages[index]);
            }
            if (actionName === 'delete'){
              this.messages[index].deleted = true;
              this.messages[index].text ="This message is deleted"
            }
          }
        }
      )
      this.selectedMessageStamps =[];
    }).bind(this);

    const commonFallback = (
      () =>{
        this.selectedMessageStamps =[];
      } 
    ).bind(this);

    
    const action : ActionRequest ={
      name: actionName,
      timestamps: [...this.selectedMessageStamps]
    }

    if (actionName === 'star'){
      this.messageService.updateMessage(
        action,
        ()=>{
          this.notifService.notificationSubject.next({
            actionname: 'starred',
            target: 'message',
            targetCount: selectedCount,
            // undo : () => {
            //   this.messageService.updateMessage(
            //     action,
            //     () => {}
            //   )
            // }
          });

          commonCallback();
        }
      )
    }else if (actionName === 'delete'){
      const alert: UIAlert = {
        actionName: 'Delete',
        target: 'message',
        fallback: commonFallback,
        options: [
          {
            name: 'Delete for me',
            call: () => {
              this.messageService.updateMessage(
                action,
                ()=>{
                  this.notifService.notificationSubject.next({
                    actionname: 'deleted',
                    target: 'message',
                    targetCount: selectedCount
                  })
                  commonCallback();
                }
              )
            }
          }
        ]
      };

      alert.options.forEach(
        option => {
          option.call = option.call.bind(this);
        }
      )

      this.alert = alert;
      this.modalService.show(this.alertModal, {animated: false});
    }

    
  }

  addNewContact(){
    if (isEmpty(this.newContact.publicUsername)){
      return;
    }

    this.dataService.findPeople(this.newContact.publicUsername, 
      (data: PeopleDTO)=> {

        if(data){
          this.newContact.result = data;
          this.newContact.nickName = data.nickName;
          this.newContact.add= ()=> {
            this.dataService.addContact(this.newContact.publicUsername, this.newContact.nickName, () => {
              if(this.newContact.result){
                this.contacts.push(this.newContact.result);
                this.notifService.notificationSubject.next({
                  actionname: 'added',
                  target: 'contact',
                  targetCount: 1
                })
                this.newContact.fallback();
              }
            })
          };
        }
        this.newContact.fallback = ()=>{
          this.newContact.publicUsername ="";
        }
        
        this.modalService.show(this.newContactModal, {animated: false});
      });

    
  }

  deleteAction(data: {publicUsername: string, targetType: 'messages' | 'chat'  | 'contact'}){

    const callback = (() => {
      if(data.targetType === 'chat'){
        const index = this.peopleList.findIndex(conv => conv.publicUsername === data.publicUsername);
        this.removeConvSelectionProps();
        this.peopleList.splice(index, 1);
      }else if(data.targetType == 'messages'){
        this.selectedConv.messages =[]
        this.selectedConv.lastMessage = undefined;
        this.messages = this.selectedConv.messages;
      }
      
    }).bind(this);

    const alert: UIAlert = {
      actionName: 'Delete',
      target: data.targetType,
      fallback: ()=> {},
      options: [
        {
          name: 'Delete' + data.targetType,
          call: () => {
            this.dataService.deleteTarget(
              data,
              ()=>{
                this.notifService.notificationSubject.next({
                  actionname: 'deleted',
                  target: data.targetType,
                  targetCount: 1
                })
                callback();
              }
            )
          }
        }
      ]
    };

    alert.options.forEach(
      option => {
        option.call = option.call.bind(this);
      }
    )

    this.alert = alert;
    this.modalService.show(this.alertModal, {animated: false});
  }

  reOrderConv (){
    this.peopleList.sort((a, b)=> {
      if (b.pinned > 0 || a.pinned > 0){
        return b.pinned - a.pinned;
      }else{
        if (!a.lastMessage){
          return 1;
        }else if (!b.lastMessage){
          return -1;
        }else{
          return b.lastMessage.timestamp - a.lastMessage.timestamp;

        }
      }
    })
  }
}
