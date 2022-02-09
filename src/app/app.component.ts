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
  pn = localStorage.pn;

  logout(){
    localStorage.removeItem('sess');
    localStorage.removeItem('pn');
    this.sess = false;
    this.pn = false;
    window.location.href = 'login';
  }
}
