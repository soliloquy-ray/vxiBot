import { AfterViewInit, Component, OnInit, ViewChild  } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import { SaveTemplateComponent } from '../../components/save-template/save-template.component';
import { NewGroupComponent } from '../../components/new-group/new-group.component';
import { GroupsComponent } from '../../components/groups/groups.component';
/*import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';*/
//declare var $ :any;
declare var host:string;

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  // providers:[HttpClient]
})
export class MessagesComponent implements  OnInit, AfterViewInit {

  @ViewChild(DataTableDirective) datatableElement : any;
  dataSet:any[] = [];
  dtOptions: any = {};
  leads: any = [];
  targets:any = [];
  targetGroups:any = [];
  groups:any = [];
  msg:string = '';
  templates:any = [];
  prevText:string = '';
  prevSelect:number = 0;
  time:any = '';
  date:any = '';
  sched:boolean = false;
  categs:any[] = [];
  min:any;
  max:any;
  @ViewChild(GroupsComponent) gr!:GroupsComponent;
  // dtTrigger: Subject<any> = new Subject<any>();
  constructor(/*private httpClient: HttpClient*/private modalService:NgbModal, public dialog: MatDialog, private _snackBar:MatSnackBar) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {verticalPosition:'top',horizontalPosition:'center',duration:5000});
  }

  add_text(s:string){
    this.msg+= ` ${s} `;
    $('#msg').focus();
  }

  openDialog(): void {
    this.modalService.dismissAll();
    let self = this;
    const dialogRef = this.dialog.open(SaveTemplateComponent, {
      //width: '350px',
      data: {msg: self.msg},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        self.saveTemplate(result);
      }else{
        console.log('you get nothing. good day sir.');
      }
    });
  }

  clearFilters(){
    this.min = this.max = undefined;
    $('table tfoot input:text, table tfoot select').val('');
    
    var table = $('table').DataTable();
    table
     .search( '' )
     .columns().search( '' )
     .draw();
  }

  ngOnInit(): void {
    let self = this;
   
    fetch(host+'get_categ')
      .then(res=>res.json())
      .then(data=>{
        self.categs = data
      }); 

    self.dtOptions = {
      ajax:host+'referrals',
      columns:[
        {
          title:'Action',
          data:'id',
          render:function(data:any, type:any, full:any){
            //return `<input type="checkbox" id="i_${data}"/>`;
            return `<input type="checkbox" class="form-control" id="i_${data}"/>`;
          }
        },
        {
          title:'Name',
          data:'name'
        },
        {
          title:'Category',
          data:'category'
        },
        {
          title:'Phone Number',
          data:'phone_number'
        }
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        let self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        // Note: In newer jQuery v3 versions, `unbind` and `bind` are 
        // deprecated in favor of `off` and `on`
        $('td input:checkbox', row).off('change');
        $('td input:checkbox', row).on('change', (e:any) => {
          //console.log(e.target.checked,data);
          if(e.target.checked){
            self.targets.push(data);
          }else{
            let ind = self.targets.findIndex((x:any)=>x.id == data.id);
            self.targets.splice(ind,1);
          }
          console.log(self.targets);
        });
        return row;
      },
      initComplete:(settings:any,data:any)=>{        
        
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
   
  }

  checkers(e:any,data:any){
    if(e.target.checked){
      this.targets.push(data);
    }else{
      let ind = this.targets.findIndex((x:any)=>x.id == data.id);
      this.targets.splice(ind,1);
    }
    console.log(this.targets);
  }
 
  checkAll(b:boolean = true){
    let self = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      let test = dtInstance.rows({page:'all',search:'applied'});//.nodes();
      // $(test.nodes()).find('input[type=checkbox]').prop('checked',b);//.trigger('change');
      /*self.targets = [];
      if(b){
        test.nodes().data().map(val=>self.targets.push(Object.assign({},val)));
      }*/
      for(let z=0;z<test.data().length;z++){
        //console.log(test.nodes()[z]);
        //$(test.nodes()[z]).find('input[type=checkbox]').prop('checked').trigger('change');
        let d = test.data()[z];
        let ind = self.targets.findIndex((a:any)=>a.id === d.id);
        $(test.nodes()[z]).find('input[type=checkbox]').prop('checked',b);
        if(b){
          if(ind < 0) self.targets.push(d);
        }else{
          self.targets = [];
        }
      }
      //console.log(self.targets);
    });
  }

  sendSMS(content:any){
     this.getTemplates();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size:'xl'}).result.then((result) => {
      if(result){
        this.smsToList();
      }
    }, (reason) => {
      console.log(reason);
    });
  }

  ngAfterViewInit(): void {
    let self = this;

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().every(function() {
        const that = this;
        $('input:text, select', this.footer()).on('keyup change', function () {
          let val = $(this).val();
          if (that.search() !== val && typeof val == 'string') {
            that
              .search(val)
              .draw();
          }
        });

        $('input[type=date]').on('change',function(){
          console.log(self.min,self.max);
          that.draw();
        })
      });
    });
  }

  async smsToList(){
    let self = this;
    if(this.targets.count < 1 && this.targetGroups.length < 1){
      this.openSnackBar(`No recipients selected.`,'OK');
      return ;
    }
    if(this.msg.length < 1){
      this.openSnackBar(`Message body is empty.`,'OK');
      return ;
    }
    if(this.sched && (this.date == '' || this.time == '')){
      this.openSnackBar(`Invalid schedule format.`,'OK');
      return ;
    }

    this.openSnackBar(`Sending sms...`,'OK');
    let succ = 0;
    await Promise.all(this.targets.map(async (a:any)=>{
      let lnk = `${host}sputnik/${a.phone_number}?msg=${encodeURIComponent(this.msg)}`;
      if(self.sched) lnk = `${host}sched_blast/${a.phone_number}?msg=${encodeURIComponent(this.msg)}&sched=${self.date}+${self.time}:00`;
      let res = await fetch(lnk)
                      .then(response=>response.text())
                      .then(r=>{
                        if(r == '1') ++succ;
                      })
                      .catch(err=>{
                        //console.warn(err);
                      });
      //console.log(res);
    }))
    this.openSnackBar(`SMS sent successfully.`,'OK');
    this.modalService.dismissAll();
  }

  /*ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }*/

  useTemplate(){
    this.msg = this.prevText;
    this.picked(0);
  }

  picked(id:number){
    this.prevSelect = id;
    let el = this.templates.find((x:any) => x.id === id);
    if(el){
      this.prevText = el.text;
    }else{
      this.prevText = '';
    }
  }

  getTemplates(){

    fetch(host+'get_templates')
      .then(res=>res.json())
      .then(data=>{
        this.templates = data
      });
  }

  saveTemplate(name:string){
    let self = this;
    let payload = {
        title: name,
        text: this.msg
    };

    this.openSnackBar('Saving template','OK');

    let data = new FormData();
    data.append( "d", JSON.stringify( payload ) );

    fetch(host+"new_template",
    {
        method: "POST",
        body: data
    })
    .then(function(res){ return res.json(); })
    .then(function(data){ 
      self.openSnackBar('Loading Templates...','OK');
      self.getTemplates();
    })
  }

}
