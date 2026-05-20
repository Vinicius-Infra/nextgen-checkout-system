import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html', // Aqui ele acha o arquivo dentro de src/app/
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'checkout-frontend';
}