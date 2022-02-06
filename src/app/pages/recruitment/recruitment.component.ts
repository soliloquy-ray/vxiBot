import { AfterViewInit, Component, OnInit, ViewChild  } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
/*import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';*/
declare var host:string;
@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.scss'],
  // providers:[HttpClient]
})
export class RecruitmentComponent implements  OnInit, AfterViewInit {

  @ViewChild(DataTableDirective) datatableElement : any;
  dtOptions: any = {};
  leads: any = [];
  targets:any[] = [];
  statusList:string[] = [];
  searchId:string = '';
  searchVxd:string = '';
  searchName:string = '';
  searchLoc:string = '';
  searchStatus:string = '';
  searchTitle:string = '';
  searchPhone:string = '';
  searchEmail:string = '';
  searchPlat:string = '';
  stamp:any;
  dlink = host+"recruitment_leads";
  // dtTrigger: Subject<any> = new Subject<any>();
  constructor(/*private httpClient: HttpClient*/private modalService:NgbModal) { }
  
  adl(th:any){
    
    this.dlink = `${host}recruitment_leads?id=${this.searchId}&name=${this.searchName}&loc=${this.searchLoc}&status=${this.searchStatus}&title=${this.searchTitle}&mob=${this.searchPhone}&email=${this.searchEmail}&plat=${this.searchPlat}&stamp=${this.stamp}&vxid=${this.searchVxd}`;
  }

  updateStatus(content:any) {
    let self = this;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size:'xs'}).result.then((result) => {
      if(result){
        let arr = self.targets.map(a=>parseFloat(a.id)).join(',');
        console.log(arr,result);
        let data = new FormData();
        data.append('d',arr);
        fetch(host+'update_status/'+encodeURIComponent(result),
        {
            method: "POST",
            body: data
        })
          .then(res=>res.json())
          .then(data=>{
            self.reload();
            console.log(data);
          });
      }
    }, (reason) => {
      console.log(reason);
    });
  }


  reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
    this.checkAll(false);
    var table = $('table').DataTable();
    table
     .search( '' )
     .columns().search( '' )
     .draw();
  }

  ngOnInit(): void {
    let self = this;
    fetch(host+'get_statuses')
      .then(res=>res.json())
      .then(d=>{
        self.statusList = d;
      })
    self.dtOptions = {
      ajax:host,
      serverSide:true,
      columns:[
        {
          title:'ID',
          data:'id',
          render:function(data:any, type:any, full:any){
            return `<input type="checkbox" class="form-control chb" id="i_${data}"/>`;
          }
        },
        {
          title:'Vixie ID',
          data:'candidate_id',
        },
        {
          title:'Name',
          data:'name'
        },
        {
          title:'Location',
          data:'location'
        },
        {
          title:'Status',
          data:'status'
        },
        {
          title:'Title',
          data:'title'
        },
        {
          title:'Date',
          data:'timestamp'
        },
        {
          title:'Phone',
          data:'phone'
        },
        {
          title:'Email',
          data:'email'
        },
        {
          title:'Platform',
          data:'platform'
        }/*,
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
        $('td input:checkbox', row).off('change');
        $('td input:checkbox', row).on('change',(e:any) => {
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
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
    /*this.httpClient.get(host+'recruitment_leads')
      .subscribe(data => {
        this.leads = data;
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
      });*/
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
        //$(test.nodes()[z]).find('input[type=checkbox]').prop('checked').trigger('change');
        let d = test.data()[z];
        let ind = self.targets.findIndex(a=>a.user_id === d.user_id);
        $(test.nodes()[z]).find('input[type=checkbox]').prop('checked',b);
        if(b){
          if(ind < 0) self.targets.push(d);
        }else{
          self.targets = [];
        }
      }
      console.log(self.targets);
    });
  }


  ngAfterViewInit(): void {
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
  }

  /*ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }*/

}
