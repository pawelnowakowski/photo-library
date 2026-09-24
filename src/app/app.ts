import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { HeaderComponent } from './core/components/header/header.component';

@Component({
  imports: [RouterOutlet, MatCard, HeaderComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
