import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConferenceListComponent } from './components/conference-list/conference-list.component';
import { KeynoteListComponent } from './components/keynote-list/keynote-list.component';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ConferenceListComponent, KeynoteListComponent],
  template: `
    <div class="container">
      <header class="header">
        <div class="header-content">
          <h1>🎤 Gestion des Conférences et Keynotes</h1>

          <div class="user-info" *ngIf="isLoggedIn">
            <span class="username">👤 {{ username }}</span>
            <span class="user-role" *ngIf="isAdmin">🔐 Admin</span>
            <button class="logout-btn" (click)="logout()">🚪 Déconnexion</button>
          </div>

          <button class="login-btn" *ngIf="!isLoggedIn" (click)="login()">
            🔐 Connexion
          </button>
        </div>

        <nav class="nav" *ngIf="isLoggedIn">
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

      <main class="main-content" *ngIf="isLoggedIn">
        <app-conference-list *ngIf="currentView === 'conferences'"></app-conference-list>
        <app-keynote-list *ngIf="currentView === 'keynotes'"></app-keynote-list>
      </main>

      <div class="welcome-message" *ngIf="!isLoggedIn">
        <h2>Bienvenue ! 👋</h2>
        <p>Veuillez vous connecter pour accéder à l'application.</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      margin-bottom: 30px;
      border-bottom: 2px solid #007bff;
      padding-bottom: 20px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    h1 {
      margin: 0;
      color: #333;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .username {
      font-weight: bold;
      color: #007bff;
    }

    .user-role {
      background: #28a745;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 0.9em;
    }

    .logout-btn, .login-btn {
      padding: 10px 20px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1em;
      transition: background 0.3s;
    }

    .login-btn {
      background: #007bff;
    }

    .logout-btn:hover {
      background: #c82333;
    }

    .login-btn:hover {
      background: #0056b3;
    }

    .nav {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    .nav button {
      padding: 12px 25px;
      border: 2px solid #007bff;
      background: white;
      color: #007bff;
      cursor: pointer;
      border-radius: 5px;
      font-size: 1em;
      transition: all 0.3s;
    }

    .nav button:hover {
      background: #e7f3ff;
    }

    .nav button.active {
      background: #007bff;
      color: white;
    }

    .main-content {
      margin-top: 30px;
    }

    .welcome-message {
      text-align: center;
      margin-top: 100px;
      padding: 40px;
      background: #f8f9fa;
      border-radius: 10px;
    }

    .welcome-message h2 {
      color: #007bff;
      margin-bottom: 15px;
    }

    .welcome-message p {
      font-size: 1.1em;
      color: #666;
    }
  `]
})
export class AppComponent implements OnInit {
  currentView = 'conferences';
  isLoggedIn = false;
  username = '';
  isAdmin = false;

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit() {
    this.isLoggedIn = await this.keycloakService.isLoggedIn();

    if (this.isLoggedIn) {
      const userProfile = await this.keycloakService.loadUserProfile();
      this.username = userProfile.username || userProfile.email || 'Utilisateur';
      this.isAdmin = this.keycloakService.getUserRoles().includes('ADMIN');

      console.log('🔐 User logged in:', this.username);
      console.log('👤 User roles:', this.keycloakService.getUserRoles());
    }
  }

  login() {
    this.keycloakService.login();
  }

  logout() {
    this.keycloakService.logout(window.location.origin);
  }
}
