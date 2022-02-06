import { Component, OnInit, AfterViewInit, ViewChild,ElementRef,Input, SecurityContext } from '@angular/core';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbToast} from '@ng-bootstrap/ng-bootstrap';
import {MatFormField, MatLabel } from '@angular/material/form-field';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DataTableDirective } from 'angular-datatables';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
declare var host:string;

@Component({
  selector: 'ngbd-modal-content',
  template: `
   <div class="modal-header">
    <h4 class="modal-title" id="modal-basic-title">Edit {{name}}</h4>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss(0)">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <form>
      <div class="form-group">
        <div class="input-group">
          <input type="hidden" [value]="id" name="id" #idd/>
          <div style="border-radius:8px;border:1px solid #ff924c;padding:10px 5px;" contenteditable #tex >{{text}}</div>
        </div>
      </div>
    </form>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-dark" (click)="activeModal.close({text:tex.innerText,id:idd.value})">Save</button>
  </div>
  `
})
export class NgbdModalContent {
  @Input() name!:string;
  @Input() text:any;
  @Input() id!:string;

  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-bot-replies',
  templateUrl: './bot-replies.component.html',
  styleUrls: ['./bot-replies.component.scss']
})
export class BotRepliesComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective) datatableElement : any;
  dtTrigger= new Subject();
  dtOptions: any = {};
  sel_label:string = '';
  div!:HTMLDivElement;
  hack:string = '';
  constructor(private _snackBar:MatSnackBar,public dialog: MatDialog, private modalService:NgbModal) { }


  open(data:{name:string,text:string,id:string}) {    
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = data.name;
    modalRef.componentInstance.id = data.id;
    modalRef.componentInstance.text = data.text;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }

  ngAfterViewInit():void{    
  }

  ngOnInit(): void {
    let self = this;
    self.dtOptions = {
      ajax:host+'get_bot_msg',
      columns:[
        {
          title:'Action',
          data:'id',
          render:function(data:any,type:any,full:any){
            return `<button class="btn btn-primary" style="font-size:0.8rem;">Apply Changes</button>`;
          }
        },/*
        {
          title:'Img',
          data:'img',
          render:function(data:any,type:any,full:any){
            return `<img src="${data}" width="200px" height="200px" style="border-radius:4px"/>`
          }
        },*/
        {
          title:'Label',
          data:'label'
        },
        {
          title:'Text',
          data:'text',
          render:function(data:any,type:any,full:any){
            return `<textarea style="white-space:normal;display:block;padding:15px;border-radius:8px;border:1px solid #ff924c;width:100%">${data}</textarea>`;
          }
        }/*,
        {
          title:'Description',
          data:'description'
        },
        {
          title:'Button Title',
          data:'action_title'
        },
        {
          title:'Actions',
          data:'action_body'
        }/*,
        {
          title:'Email',
          data:'email'
        },
        {
          title:'Platform',
          data:'platform'
        },
        {
          title:'Last Name',
          data:'last_name'
        }*//*,
        {
          title:'Description',
          data:'description'
        },
        {
          title:'URL',
          data:'url',
          render:function(data:any, type:any, full:any){
            return `<a href='${data}' target='_blank'>Link</a>`;
          }
        },
        {
          title:'Image',
          data:'img',
          render: function (data: any, type: any, full: any) {
            return `<img class='fifty' src='${data}'/>`;
          }
        }*/
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        let self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        // Note: In newer jQuery v3 versions, `unbind` and `bind` are 
        // deprecated in favor of `off` and `on`
        $('td button', row).off('click');
        $('td button', row).on('click', (e) => {
          //self.openDialog(data);
          // self.open({name:data.label,id:data.id,text:data.text});
          // self.toast.show();
          //self.sub({id:data.id,text:data.text});
          let tr = <HTMLTableRowElement> e.target.parentElement!.parentElement;
          let dv = $(tr).find('textarea');
          let txt = dv[0].value;
          self.sub({id:data.id,text:txt});
        });
        return row;
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    }
    /*this.httpClient.get(host+'recruitment_leads')
      .subscribe(data => {
        this.leads = data;
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
      });*/
    }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {verticalPosition:'top',horizontalPosition:'center',duration:5000});
  }

  fetchData(){
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }

  sub(data:any){
    let self = this;
    // self.hack = encodeURIComponent(data.text);
    // return ;
    // console.log(data);
    this.openSnackBar('Saving chatbot reply message...','OK');

    fetch(host+"update_bot_msg/"+data.id+"?text="+encodeURIComponent(data.text))
    .then(function(res){ return res.text(); })
    .then(function(data){ 
      self.openSnackBar('Done.','OK');
      self.fetchData();
    })
    .catch(e=>{
      self.openSnackBar('An error was encountered. Please try again later.','OK');
    })
  }

}
