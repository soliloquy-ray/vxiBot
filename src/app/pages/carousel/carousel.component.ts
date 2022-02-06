import { Component, OnInit, AfterViewInit, ViewChild,ElementRef } from '@angular/core';
import {MatFormField, MatLabel } from '@angular/material/form-field';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DataTableDirective } from 'angular-datatables';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { EditCarouselComponent } from '../../components/edit-carousel/edit-carousel.component';

declare var host:string;
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit {

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
    const dialogRef = this.dialog.open(EditCarouselComponent, {
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
      ajax:host+'get_carousel?data=1',
      columns:[
        {
          title:'ID',
          data:'id',  
          render:function(data:any,type:any,full:any){
            return `<button class="btn btn-primary">Edit</button>`
          }
        },
        {
          title:'Img',
          data:'img',
          render:function(data:any,type:any,full:any){
            return `<img src="${data}" width="200px" height="200px" style="border-radius:4px"/>`
          }
        },
        {
          title:'Category',
          data:'category'
        },
        {
          title:'Title',
          data:'title'
        },
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

  /*updImg($event:any){
    let self=this;
    let reader = new FileReader();
    reader.onload = function(){
      self.img.nativeElement.src = reader.result;
    };
    reader.readAsDataURL($event.target.files[0]);
  }
*/
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

  /*sub(data:any){
    let self = this;
    console.log(data);
    return ;
    let frm = new FormData();
    frm.append('id',data.id);
    frm.append('category',data.category);
    frm.append('title',data.title);
    frm.append('description',data.description);
    frm.append('action_title',data.action_title);
    frm.append('action_body',data.action_body);
    this.openSnackBar('Saving carousel information...','OK');

    fetch(host+"update_carousel",
    {
        method: "POST",
        body: frm
    })
    .then(function(res){ return res.json(); })
    .then(function(data){ 
      self.openSnackBar('Done.','OK');
      self.fetchData();
    })
    .catch(e=>{
      self.openSnackBar('An error was encountered. Please try again later.','OK');
    })
  }*/

}
