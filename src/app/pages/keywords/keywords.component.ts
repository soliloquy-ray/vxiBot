import { Component, OnInit, AfterViewInit, ViewChild,ElementRef } from '@angular/core';
import {MatFormField, MatLabel } from '@angular/material/form-field';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DataTableDirective } from 'angular-datatables';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';

import {EditKeywordComponent} from '../../components/edit-keyword/edit-keyword.component';

declare var host:string;
@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.scss']
})
export class KeywordsComponent implements OnInit, AfterViewInit {

  // @ViewChild('prev') img !:ElementRef;
  @ViewChild('form') form !:ElementRef;
  @ViewChild(DataTableDirective) datatableElement : any;
  dtTrigger= new Subject();
  dtOptions: any = {};
  data:any;
  editing:{id:number,category:string,title:string,description:string,action_title:string,action_body:string,status:number} = {id:0,category:'',title:'',description:'',action_title:'',action_body:'',status:0};
  prev:string = '';
  constructor(private _snackBar:MatSnackBar,public dialog: MatDialog) { }

  openDialog(data:any): void {
    let self = this;
    const dialogRef = this.dialog.open(EditKeywordComponent, {
      //width: '350px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      self.fetchData();
    });
  }

  ngOnInit(): void {let self = this;
    self.dtOptions = {
      ajax:host+'get_keywords',
      columns:[
        {
          title:'ID',
          data:'id',  
          render:function(data:any,type:any,full:any){
            return `<button class="btn btn-primary">Edit</button>`
          }
        },
        {
          title:'Question',
          data:'question',
          render:function(data:any,type:any,full:any){
            return `<textarea readonly resize="none" style="border-radius:4px;resize:none;width:100%;height:auto">${data}</textarea>`
          }
        },
        {
          title:'Response',
          data:'response',
          render:function(data:any,type:any,full:any){
            return `<textarea readonly resize="none" style="border-radius:4px;resize:none;width:100%;height:auto">${data}</textarea>`
          }
        },
        {
          title:'Status',
          data:'status'
        },
        {
          title:'Keyboard Carousel Name',
          data:'keyboard_carousel_name'
        }
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        let self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        // Note: In newer jQuery v3 versions, `unbind` and `bind` are 
        // deprecated in favor of `off` and `on`
        $('td button', row).off('click');
        $('td button', row).on('click', () => {
          self.openDialog(data);
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

  select(d:any){
    console.log(d);
    this.editing = d;
    this.prev = d.img;
    // this.img.nativeElement.src = d.img;
  }

  fetchData(){
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }

}
