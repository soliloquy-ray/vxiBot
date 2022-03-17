import { Component, OnInit, AfterViewInit, ViewChild,ElementRef } from '@angular/core';
import {MatFormField, MatLabel } from '@angular/material/form-field';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DataTableDirective } from 'angular-datatables';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';

declare var host:string;
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, AfterViewInit {

  // @ViewChild('prev') img !:ElementRef;
  @ViewChild('form') form !:ElementRef;
  @ViewChild(DataTableDirective) datatableElement : any;
  dtTrigger= new Subject();
  dtOptions: any = {};
  data:any;
  user:string = '';
  pass:string = '';
  cpass:string = '';
  access:string = '';
  constructor(private _snackBar:MatSnackBar,public dialog: MatDialog, private modalService:NgbModal) { }


  newUser(content:any) {
    let self = this;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(result > 0 && self.user.length > 0 && self.pass.length > 0 && self.access.length > 0){
        let frm = new FormData(<HTMLFormElement>$('.userform').get(0));
    
        fetch(`${host}add_user_account`,
            {
                method: "POST",
                body: frm
            })
            .then(response=>response.json())
            .then(r=>{
              self.fetchData();
              self.openSnackBar('User has been added.','OK');
            })
            .catch(err=>{console.warn(err)});
      }
    }, (reason) => {
      console.log(reason);
    });
  }

  ngOnInit(): void {let self = this;
    self.dtOptions = {
      ajax:host+'get_user_accounts',
      columns:[
        /* {
          title:'Action',
          data:'user',  
          render:function(data:any,type:any,full:any){
            return `<button class="btn btn-primary">Edit</button>`
          }
        }, */
        {
          title:'Username',
          data:'user'
        },
        {
          title:'Access Type',
          data:'access',
          render:function(data:any,type:any,full:any){
            return data == '1' ? 'Regular' : 'Admin';
          }
        }/* ,
        {
          title:'Status',
          data:'status'
        },
        {
          title:'Keyboard Carousel Name',
          data:'keyboard_carousel_name'
        } */
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        let self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        // Note: In newer jQuery v3 versions, `unbind` and `bind` are 
        // deprecated in favor of `off` and `on`
        $('td button', row).off('click');
        $('td button', row).on('click', () => {
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


  ngAfterViewInit(): void{
    let self = this;
    console.log(self.datatableElement);
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().every(function() {
        const that = this;
        $('input', this.footer()).on('keyup change', function () {
          let val = $(this).val();
          if (that.search() !== val && typeof val == 'string') {
            that
              .search(val)
              .draw();
          }
        });
      });
    });
    // this.fetchData();
  }

  fetchData(){
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
    this.user = '';
    this.pass = '';
    this.cpass = '';
    this.access = '';
  }

}
