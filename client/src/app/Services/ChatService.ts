import * as io from "socket.io-client";
import {MyMessage} from '../DTO/MyMessage';
import {Observable} from 'rxjs/Observable';

export class ChatService
{
  private url:string="http://localhost:3000";
  public socket;

  constructor()
  {
    this.socket=io(this.url);
  }

  public sendMessage(message:MyMessage)
  {
    message.senderId=this.socket.id;
    this.socket.emit("new-message",message);
  }

  public getMessages=()=>
  {
    return Observable.create((observer)=>{
      this.socket.on("incomming-message",(message)=>{
        observer.next(message);
      })
    });
  }
}
