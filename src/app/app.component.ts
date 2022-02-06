import { Component } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  faBars = faBars;
  title = 'vxiBot';
  sess = localStorage.sess || false;

  logout(){
    localStorage.removeItem('sess');
    this.sess = false;
    window.location.href = 'login';
  }
}
