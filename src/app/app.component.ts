import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'music-etc';
  description = 'music-etc';
  mobileShow = 'hidden';

  displayMobileMenu($event){
    $event.target.nextElementSibling.classList.toggle("show")
  }
}
