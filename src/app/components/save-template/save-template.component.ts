import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  text: string;
}

@Component({
  selector: 'app-save-template',
  templateUrl: './save-template.component.html',
  styleUrls: ['./save-template.component.scss']
})
export class SaveTemplateComponent implements OnInit {

  title:string = 'template';
  constructor(
    public dialogRef: MatDialogRef<SaveTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    console.log(this.data);
  }

  ngOnInit(){

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
