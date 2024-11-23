import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainformComponent } from "./forms/mainform/mainform.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MainformComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'forms-poc';
}
