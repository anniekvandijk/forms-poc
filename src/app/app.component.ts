import { Component } from '@angular/core';
import { MainformComponent } from './forms/mainform/mainform.component';

@Component({
  selector: 'app-root',
  imports: [MainformComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'forms-poc';
}
