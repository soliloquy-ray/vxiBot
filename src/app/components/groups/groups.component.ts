import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
declare var host:string;
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  @Output() open: EventEmitter<any> = new EventEmitter();
  @Output() grOpen: EventEmitter<any> = new EventEmitter();
  groups:any = [];
  targetGroups:any = [];
  members:any = [];
  constructor(private modalService:NgbModal) { }

  ngOnInit(): void {
    this.initGroups();
  }

  openModal(content:any,m:number) {   
    let self = this; 
    fetch(host+'get_users_groups/'+m)
    .then(response => response.json())
    .then(data =>{
      self.members = data;

      self.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
    });
  }

  initGroups(){
    let self = this;
    fetch(host+'get_groups')
    .then(response => response.json())
    .then(data =>{
      if(data.length < 1) return ;
      self.groups = data;
    });
  }

  newGroup(){
    this.open.emit('new');
    this.grOpen.emit('new');
    return true;
  }

  checkers(event:any){
    console.log(event);
    if(event.target.checked){
      this.targetGroups.push(event.target.value);
    }else{
      let i = this.targetGroups.indexOf(event.target.value);
      this.targetGroups.splice(i,1);
    }
    this.open.emit({arr:this.targetGroups});
    this.grOpen.emit({arr:this.targetGroups});
  }

  addToGroup(){
    
  }

  getGroups():Array<any>{
    return this.groups;
  }
}
