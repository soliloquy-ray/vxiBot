import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
declare var host:string;
export interface DialogData {
  id: number;
  category: string;
  title:string;
  description:string;
  action_title:string;
  action_body:string;
  status:number;
  img:string;
}

@Component({
  selector: 'app-edit-carousel',
  templateUrl: './edit-carousel.component.html',
  styleUrls: ['./edit-carousel.component.scss']
})
export class EditCarouselComponent implements OnInit, AfterViewInit {

  @ViewChild('prev') img !:ElementRef;
  @ViewChild('form') frm!:HTMLFormElement;
  imageChanged:boolean = false;
  editing:{id:number,category:string,title:string,description:string,action_title:string,action_body:string,status:number,img:string} = {id:0,category:'',title:'',description:'',action_title:'',action_body:'',status:0,img:''};
  constructor(
    public dialogRef: MatDialogRef<EditCarouselComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _snackBar:MatSnackBar
  ) {
    this.editing = this.data;
  }

  ngOnInit():void{

  }

  ngAfterViewInit():void{
    this.img.nativeElement.src = this.editing.img;
    console.log(this.frm);
  }

  updImg($event:any){
    let self=this;
    self.imageChanged = true;
    let reader = new FileReader();
    reader.onload = function(){
      self.img.nativeElement.src = reader.result;
    };
    reader.readAsDataURL($event.target.files[0]);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {verticalPosition:'top',horizontalPosition:'center',duration:5000});
  }

  sub(){
    let self = this;
    let frm = new FormData(self.frm.nativeElement);
    // return ;
    this.openSnackBar('Saving carousel information...','OK');

    fetch(host+"update_carousel",
    {
        method: "POST",
        body: frm
    })
    .then(function(res){ return res.json(); })
    .then(function(data){ 
      self.openSnackBar('Done.','OK');
      self.dialogRef.close();
    })
    .catch(e=>{
      self.openSnackBar('An error was encountered. Please try again later.','OK');
    })
  }
}
