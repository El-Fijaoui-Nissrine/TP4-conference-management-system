import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConferenceListComponent } from './components/conference-list/conference-list.component';
import { KeynoteListComponent } from './components/keynote-list/keynote-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ConferenceListComponent, KeynoteListComponent],
  template: `
    <div class="container">
      <header class="header">
        <h1>🎤 Gestion des Conférences et Keynotes</h1>
        <nav class="nav">
          <button (click)="currentView = 'conferences'"
                  [class.active]="currentView === 'conferences'">
            📅 Conférences
          </button>
          <button (click)="currentView = 'keynotes'"
                  [class.active]="currentView === 'keynotes'">
            👨‍💼 Keynotes
          </button>
        </nav>
      </header>

      <main class="main-content">
        <app-conference-list *ngIf="currentView === 'conferences'"></app-conference-list>
        <app-keynote-list *ngIf="currentView === 'keynotes'"></app-keynote-list>
      </main>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .nav { margin: 20px 0; }
    .nav button {
      margin: 0 10px;
      padding: 10px 20px;
      border: none;
      background: #f0f0f0;
      cursor: pointer;
      border-radius: 5px;
    }
    .nav button.active {
      background: #007bff;
      color: white;
    }
    .main-content { margin-top: 20px; }
  `]
})
export class AppComponent {
  currentView = 'conferences';
}
