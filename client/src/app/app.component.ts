import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from './Services/ChatService';
import {MyMessage} from './DTO/MyMessage';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  message: MyMessage;
  messages: MyMessage[] = [];
  nickName: string = '';
  private msgContainer:ElementRef;
  chatService: ChatService;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.chatService = new ChatService();
    this.message = new MyMessage();
    this.message.senderId=this.chatService.socket.id;
    this.chatService.getMessages().subscribe((message) => {
      this.messages.push(message);
    });
  }

  sendMesage(msgCtnr:ElementRef) {
    this.chatService.sendMessage(this.message);
    this.message.text = '';
  }

  setNickName() {
    if (this.nickName == '' || this.nickName == null) {
      return;
    }
    this.http.post('http://localhost:3000/getMessages',"",{responseType:"text"})
      .subscribe(response => {
        this.messages=this.messages.concat(JSON.parse(response) as (Array<MyMessage>));
        this.message.nickName = this.nickName;
      }, error => {
      }, () => {
      });
  }

  private scrollToBottom()
  {
    try {
      this.msgContainer.nativeElement.scrollTop=this.msgContainer.nativeElement.scrollHeight
    }
    catch (e)
    {
      console.error("Scrolling Error",e);
    }
  }
}
