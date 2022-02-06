import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
declare var host:string;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private _snackBar:MatSnackBar) {
    if(localStorage.sess){
      window.location.href = 'home';
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {verticalPosition:'top',horizontalPosition:'center',duration:5000});
  }

  ngOnInit(): void {
  }

  login(f:HTMLFormElement){
    let self = this;
    let form = new FormData(f);

    fetch(host+"login",
    {
        method: "POST",
        body: form
    })
    .then(function(res){ return res.text(); })
    .then(function(data){ 
      if(data == '1'){
        localStorage.sess = 1;
        window.location.href = 'home';
      }else{
        self.openSnackBar('Invalid login.','OK');
      }
    })
  }
}
