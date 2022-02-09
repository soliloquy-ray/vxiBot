import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CounterInfoComponent } from '../../components/counter-info/counter-info.component';
import { faUsers, faUser, faUserCheck, faUserTag, faUserFriends, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Chart} from 'angular-highcharts';

declare var host:string;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CounterInfoComponent) cif:any;
  faUsers = faUsers;
  faUser = faUser;
  faUserCheck = faUserCheck;
  faUserFriends = faUserFriends;
  faUserPlus = faUserPlus;
  activeUsers = 0;
  totalUsers = 0;
  dailyApplicants = 0;
  totalApplicants = 0;
  totalSubs = 0;
  totalDupes = 0;
  totalLeads = 0;
  totalHired = 0;

  conversionApp:any;
  conversionPos:any;
  conversionLoc:any;
  sites:any[] = [];
  charts:any[] = [];

  active:number = 1;
  int:any;
  dateStart:any = null;
  dateEnd:any = null;

  targetLoc:any = '';

  constructor() { }

  initChart(data:Array<any>,title:string='Site',ind:number = 0){
    this.charts[ind] = new Chart({
      chart: {
          plotShadow: false,
          animation: false,
          type: 'pie'/*,
          events: {
            load: function() {
              console.log(this);
              this.update({
                  chart: { spacingBottom: 50 }
              }, false);
              this.redraw(false);
            },
            render: function() {
              this.update({
                chart: {
                  animation: true
                }
              })
            }
          }*/
      },
      colors:['gold','steelblue','forestgreen','blueviolet','darkred','royalblue','#7fa956','darkorange','deepskyblue','hotpink','wheat'],
      title: {
          text: 'Applicants By '+title
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.y}'
              }
          },
          series: {
            animation: {
              duration: 0
            }
          }
      },
      series: [{
          name: 'Brands',
          type:'pie',
          colorByPoint: true,
          data: data
      }]
  });
     //console.log(this.charts);
  }

  ngOnInit(): void {
    let self = this;
    self.fetchData();
    self.initGraphs();

    fetch(host+'get_sites')
      .then(res=>res.json())
      .then(data=>{
        self.sites = data
      });
  }

  initGraphs(){
    let self = this;
    fetch(host+`stats_applicants_by_job?s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.initChart(data.map((a:any)=>{return {name:a.title,y:parseFloat(a.ct)}}),'Job',2);
    });
    fetch(host+`stats_applicants_by_loc?s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.initChart(data.map((a:any)=>{return {name:a.title,y:parseFloat(a.ct)}}),'Site',0);
    });
    fetch(host+`stats_applicants_filter/status?loc=${self.targetLoc}&s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.initChart(data.map((a:any)=>{return {name:a.status,y:parseFloat(a.ct)}}),'Status',1);
    });
    fetch(host+`candidates_by_source?s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.initChart(data.map((a:any)=>{return {name:a.platform,y:parseFloat(a.ct)}}),'Platform',3);
    });
  }

  ngOnDestroy(){
    clearInterval(this.int);
  }

  reloadData(d:any = ''){
    this.fetchData();
    this.initGraphs();
  }

  fetchData(d:any = ''){
    let self = this;
    clearInterval(self.int);

    fetch(host+`stats_active_users?s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.activeUsers = data;
    }).catch(err=>self.activeUsers=0);

    fetch(host+`stats_total_users?s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.totalUsers = data;
    });

    fetch(host+`stats_applicants_daily?s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.dailyApplicants = data;
    });

    fetch(host+`stats_total_applicants?s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.totalApplicants = data;
    });

    fetch(host+`stats_total_subs`)
    .then(response => response.json())
    .then(data =>{
      self.totalSubs = data;
    });

    fetch(host+`stats_total_duplicates?s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.totalDupes = data;
    });

    fetch(host+`stats_total_leads?s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.totalLeads = data;
    });

    fetch(host+`stats_total_hired?s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.totalHired = data;
    });

    self.int = setInterval(function(){
      self.fetchData();
    },5000);
  }
  //Hi $name! My name is Vixie, the automated Recruitment Assistant for VXI Philippines. I’m here to assist you with your application today. 😄

  reInitGraphs(){
    let self = this;
    fetch(host+`stats_applicants_by_job?s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.charts[2].options.series[0].data = data.map((a:any)=>{return {name:a.title,y:parseFloat(a.ct)}});
      // console.log(self.charts[2]);
    });
    fetch(host+`stats_applicants_by_loc?s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.charts[0].options.series[0].data = data.map((a:any)=>{return {name:a.title,y:parseFloat(a.ct)}});
      // console.log(self.charts[0]);
    });
    fetch(host+`stats_applicants_filter/status?loc=${self.targetLoc}&s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.charts[1].options.series[0].data = data.map((a:any)=>{return {name:a.title,y:parseFloat(a.ct)}});
      // console.log(self.charts[1]);
    });
    fetch(host+`candidates_by_source?s=${self.dateStart}&e=${self.dateEnd}`)
    .then(response => response.json())
    .then(data =>{
      self.charts[3].options.series[3].data = data.map((a:any)=>{return {name:a.platform,y:parseFloat(a.ct)}});
      // console.log(self.charts[0]);
    });

  }

  ngAfterViewInit(){
    let self = this;
  }

}
