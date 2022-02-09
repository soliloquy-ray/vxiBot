import { AfterViewInit, Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';

import { SaveTemplateComponent } from '../../components/save-template/save-template.component';
import { NewGroupComponent } from '../../components/new-group/new-group.component';
import { GroupsComponent } from '../../components/groups/groups.component';
import * as moment from 'moment';
import { inArray } from 'jquery';
/*import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';*/
//declare var $ :any;
declare var host:string;

@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.scss']
})
export class OutboxComponent implements OnInit {

  @ViewChild(DataTableDirective) datatableElement : any;
  dataSet:any[] = [];
  dtOptions: any = {};
  dlink = host+"recruitment_leads";
  exportFrom:any = moment().format('YYYY-MM-DD');
  exportTo:any= moment().format('YYYY-MM-DD');
  
  faPaperclip = faPaperclip;
  imageChanged:boolean = false;
  mobs:string = '';
  //@ViewChild('prev') img!:ElementRef;
  @ViewChild(GroupsComponent) gr!:GroupsComponent;
  prev:any = './assets/favicon.png';
  // dtTrigger: Subject<any> = new Subject<any>();
  constructor(/*private httpClient: HttpClient*/private modalService:NgbModal, public dialog: MatDialog, private _snackBar:MatSnackBar) { }

  adl(th:any){
    
    this.dlink = `${host}m_outbox?dl=1&exportFrom=${this.exportFrom}&exportTo=${this.exportTo}`;
  }

  clearFilters(){
    $('table tfoot input:text, table tfoot select').val('');
    
    var table = $('table').DataTable();
    table
     .search( '' )
     .columns().search( '' )
     .draw();
  }

  ngOnInit(): void {
    let self = this;
    /*fetch(host+'main_candidates')
        .then(result=>result.json())
        .then(data=>{
          self.dataSet = data.data;
        })*/

    self.dtOptions = {
      sAjaxSource:host+'m_outbox',
      "bProcessing": true,
      "bServerSide": true,
      order:[[3,'desc']],
      serverData:function(source:any,data:any,callback:any, oSettings:any ) {
        oSettings.jqXHR = $.ajax( {
          "dataType": 'json',
          "type": "POST",
          "url": source,
          "data": data,
          "success": callback
        } );
      },
      columns:[
        {
          title:'ID',
          data:'id'
        },
        {
          title:'Message',
          data:'msg',
          render:function(data:any, type:any, full:any){
            return "<textarea readonly style='height:100%;width:100%'>"+data+"</textarea>";
          }
        },
        {
          title:'Phone Number',
          data:'cel'
        },
        {
          title:'Schedule',
          data:'schedule'
        },
        {
          title:'Status',
          data:'status'
        }
      ],
      initComplete:(settings:any,data:any)=>{      
        // self.candidates = data.ids.map((i:any)=>{return i.id}); 
      },
      drawCallback:(settings:any)=>{        
        // self.candidates = data.ids.map((i:any)=>{return i.id});
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
   
  }
  
  reload(clear:boolean = false) {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }

  ngAfterViewInit(): void {
    let self = this;
    let tbl = $('[id^=DataTables]').DataTable();

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
          // console.log(self.min,self.max);
          that.draw();
        })
      });
    });
  }

}