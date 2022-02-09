import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import {NgbModal,NgbActiveModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {MatSnackBar} from '@angular/material/snack-bar';
declare var host:string;

@Component({
  selector: 'ngbd-modal-content',
  template: `    
  <div class="modal-header">
    <h4 class="modal-title" id="modal-basic-title">Delete Member</h4>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss(0)">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    Are you sure you want to remove this member from the group?
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" (click)="activeModal.close(1)">Yes</button>
    <button type="button" class="btn btn-outline-dark" (click)="activeModal.close(0)">Cancel</button>
  </div>
  `
})
export class NgbdModalContent {
  @Input() name:string = '';

  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})

export class GroupsComponent implements OnInit {

  @ViewChild(DataTableDirective) datatableElement : any;
  @Output() open: EventEmitter<any> = new EventEmitter();
  @Output() grOpen: EventEmitter<any> = new EventEmitter();
  dtOptions: any = {};
  groups:any = [];
  targetGroups:any = [];
  members:any = [];
  tgroup:number = 0;
  editGroup = {id:0,name:''}
  constructor(private modalService:NgbModal, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.initGroups();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {verticalPosition:'top',horizontalPosition:'center',duration:5000});
  }
  
  likeABrute(id:number){
    let self = this;
    this.modalService.open(NgbdModalContent).result.then((result) => {
      if(result > 0){
        console.log(id,self.tgroup);
        fetch(`${host}rem_user_group/${id}/${self.tgroup}`)
                      .then(r=>r.text())
                      .then(()=>{                        
                        $('table.grp').DataTable().ajax.reload();
                      })
                      .catch(console.warn)
      }
    }, (reason) => {
      console.log(reason);
    });
  }

  initDtTbl(m:any){
    let self = this;
    self.tgroup = m;
    self.dtOptions = {
      ajax:host+'get_users_groups/'+m,
      columns:[
        { 
          title: 'Action',
          data:'user_id',
          render:function(data:any, type:any, full:any){
            return "<button id='delmem_"+data+"' class='btn btn-outline-dark'>Delete</button>";
          }
        },
        {
          title:'Name',
          data:'name',
        },
        {
          title:'Phone Number',
          data:'cel'
        },
      ],
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      rowCallback: (row: Node, data: any | Object, index: number) => {
        let self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        // Note: In newer jQuery v3 versions, `unbind` and `bind` are 
        // deprecated in favor of `off` and `on`
        $('td button', row).off('click');
        $('td button', row).on('click', (e:any) => {
          let id = e.target.id.split("_")[1];
          self.likeABrute(id);//'delmember',self.tgroup);
        });
      }

    }
  }

  ngAfterViewInit(): void {
  }

  openRenameGroupModal(content:any,g:{id:number,name:string}){
    let self = this;
    self.editGroup = g;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(result){
        fetch(host+'update_groups/'+result.id+'?name='+encodeURIComponent(result.name)).then(()=>{
          self.openSnackBar('Group name updated','OK');
        }).catch(console.warn);
      }
    }, (reason) => {
      console.warn(reason);
    });
  }

  openDelGroupModal(content:any,m:number){
    let self = this;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(result > 0){
        fetch(`${host}del_group/${m}`)
                      .then(r=>r.text())
                      .then(()=>{ self.openSnackBar('Group deleted successfully','OK'); self.initGroups()})
                      .catch(console.warn)
      }
    }, (reason) => {
      console.log(reason);
    });
  }

  openModal(content:any,m:number) {   
    let self = this; 
    self.initDtTbl(m);
    self.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
    /* fetch(host+'get_users_groups/'+m)
    .then(response => response.json())
    .then(data =>{
      self.members = data;

      self.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
    }); */
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
