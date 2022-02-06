import { Component, OnInit, ViewChild } from '@angular/core';
import { UserChatsComponent } from '../../components/user-chats/user-chats.component';
import {MatFormField, MatLabel } from '@angular/material/form-field';
import {MatSnackBar} from '@angular/material/snack-bar';
declare var host:string;
@Component({
  selector: 'app-chat-replies',
  templateUrl: './chat-replies.component.html',
  styleUrls: ['./chat-replies.component.scss']
})
export class ChatRepliesComponent implements OnInit {

  @ViewChild(UserChatsComponent) usc!: UserChatsComponent;
  msg:string ='';
  preview:string = '';
  data:any;
  dispMessages:any[] = [];
  sent:string = '';
  replyTo:number = 0;
  constructor(private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
  }

  msgr($event:any){
    let self = this;
    this.data = $event;
    this.preview = this.data.msg;
    this.sent = this.data.created;

    fetch(host+"get_user_chat/"+this.data.user_id)
    .then(function(res){ return res.json(); })
    .then(function(data){ 
      self.dispMessages = data;
      self.replyTo = self.dispMessages[data.length-1].id;
      console.log(self.replyTo,self.dispMessages);
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {verticalPosition:'top',horizontalPosition:'center',duration:5000});
  }



  botReply(){    
    let self = this;
    let tpl = self.dispMessages[self.dispMessages.length - 1];
    self.openSnackBar('Sending message...','');
    let frm = new FormData();
    frm.append('type','outgoing_msg');
    frm.append('platform',tpl.platform);
    frm.append('user_id',tpl.user_id);
    frm.append('message',self.msg);
    // return ;

    fetch(host+"outgoing_bot_msg",
    {
        method: "POST",
        body: frm
    })
    .then(function(res){ return res.json(); })
    .then(function(data){ 
      self.openSnackBar('Done.','OK');
      self.msg = "";
      self.usc.populate();
    })
    .catch(e=>{
      self.openSnackBar('An error was encountered. Please try again later.','OK');
    })
  }
}
