import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
declare var host:string;
export interface DialogData {
  id: number;
  question: string;
  response:string;
  status:number;
  keyboard_carousel_name:string;
}

@Component({
  selector: 'app-edit-keyword',
  templateUrl: './edit-keyword.component.html',
  styleUrls: ['./edit-keyword.component.scss']
})
export class EditKeywordComponent implements OnInit, AfterViewInit {

  @ViewChild('prev') img !:ElementRef;
  @ViewChild('form') frm!:HTMLFormElement;
  imageChanged:boolean = false;
  editing:{id:number,question:string,response:string,status:number,keyboard_carousel_name:string} = {id:0,question:'',response:'',status:1,keyboard_carousel_name:''};
  constructor(
    public dialogRef: MatDialogRef<EditKeywordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _snackBar:MatSnackBar
  ) {
    this.editing = this.data;
  }

  ngOnInit():void{

  }

  ngAfterViewInit():void{
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
    this.openSnackBar('Saving keyword data...','OK');

    fetch(host+"update_cb_keywords",
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
