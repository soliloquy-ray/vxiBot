import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';

declare var host:string;
@Component({
  selector: 'app-user-chats',
  templateUrl: './user-chats.component.html',
  styleUrls: ['./user-chats.component.scss']
})
export class UserChatsComponent implements OnInit, OnDestroy {
  search:string = '';
  faUser = faUser;
  selected:number = 0;
  @Output() open: EventEmitter<any> = new EventEmitter();
  data :any = []
  int:any;
  constructor() { }

  ngOnInit(): void {
    let self = this;   
    self.populate();
    self.int = setInterval(function(){
      self.populate();
    },10000);
  }

  ngOnDestroy(){
    clearInterval(this.int);
  }

  populate(){
    let self = this;
    fetch(host+'get_user_chat')
    .then(response => response.json())
    .then(data =>{
      if(data.length < 1) return ;
      self.data = data;
    });
  }

  replyMsg(id:number,type:string,m:string,userid:number,created:string){
    this.selected = id;
    if(type != "outgoing_msg") id = 0;
    this.open.emit({id:id,msg:m,user_id:userid,created:created,type:type});
    //console.log(id);
    return true;
  }
}
