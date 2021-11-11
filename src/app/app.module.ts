import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MessageletComponent } from './components/messagelet/messagelet.component';
import { FormsModule } from '@angular/forms';
import { MessageService } from './service/message.service';
import { ChatToolBarComponent } from './components/chat-tool-bar/chat-tool-bar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ChatPeopleComponent } from './components/chat-people/chat-people.component';
import { ChatBoxTopBarComponent } from './components/chat-box-top-bar/chat-box-top-bar.component';
import { ChatBoxBotBarComponent } from './components/chat-box-bot-bar/chat-box-bot-bar.component';
import { AuthService } from './service/auth.service';
import { DataService } from './service/data.service';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RightPanelComponent } from './components/right-panel/right-panel.component';
import { TogglerService } from './service/toggler.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MessageletComponent,
    ChatToolBarComponent,
    SearchBarComponent,
    ChatPeopleComponent,
    ChatBoxTopBarComponent,
    ChatBoxBotBarComponent,
    LoginPageComponent,
    RightPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [MessageService, AuthService, DataService, TogglerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
