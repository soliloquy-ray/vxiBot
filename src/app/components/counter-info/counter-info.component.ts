import { Component, OnInit, Input, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-counter-info',
  templateUrl: './counter-info.component.html',
  styleUrls: ['./counter-info.component.scss']
})
export class CounterInfoComponent implements OnInit, AfterViewInit {
  @ViewChild('ic') ic!:ElementRef;
  @Input('title') title:string = '';
  @Input('icon') icon:any = faUsers;
  @Input('count') count:number = 0;
  @Input('color') color:string = '#333';
  constructor(private render:Renderer2) { }

  ngOnInit(): void {
    //this.icon = faUsers;
  }

  ngAfterViewInit(){    
    // console.log(this.ic);
    this.render.setStyle(this.ic.nativeElement,'background-color',this.color);
  }
}
