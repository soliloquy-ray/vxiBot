import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface GroupData {
  name: string;
}

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent implements OnInit {

  name:string = 'group';
  constructor(
    public dialogRef: MatDialogRef<NewGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GroupData,
  ) {
    console.log(this.data);
  }

  ngOnInit(){

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
