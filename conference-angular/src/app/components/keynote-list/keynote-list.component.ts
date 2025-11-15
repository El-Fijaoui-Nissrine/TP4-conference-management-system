import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Keynote } from '../../models/keynote.model';
import { KeynoteService } from '../../services/keynote.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-keynote-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './keynote-list.component.html',
  styleUrls: ['./keynote-list.component.css']
})
export class KeynoteListComponent implements OnInit {
  keynotes: Keynote[] = [];
  editingKeynote: Keynote | null = null;

  newKeynote: Keynote = {
    nom: '',
    prenom: '',
    email: '',
    fonction: ''
  };

  // Gestion des rôles
  isAdmin = false;

  constructor(
    private keynoteService: KeynoteService,
    private keycloakService: KeycloakService
  ) {}

  async ngOnInit() {
    // Vérifier les rôles de l'utilisateur
    const roles = this.keycloakService.getUserRoles();
    this.isAdmin = roles.includes('ADMIN');

    console.log('👤 User roles in KeynoteList:', roles);
    console.log('🔐 Is Admin:', this.isAdmin);

    this.loadKeynotes();
  }

  loadKeynotes(): void {
    this.keynoteService.getAllKeynotes().subscribe({
      next: (data) => {
        this.keynotes = data;
        console.log('✅ Keynotes loaded:', data);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des keynotes:', error);
        alert('Erreur lors du chargement des keynotes');
      }
    });
  }

  createKeynote(): void {
    if (!this.isAdmin) {
      alert('❌ Seuls les administrateurs peuvent créer des keynotes');
      return;
    }

    this.keynoteService.createKeynote(this.newKeynote).subscribe({
      next: (keynote) => {
        this.keynotes.push(keynote);
        this.resetForm();
        console.log('✅ Keynote créé avec succès');
      },
      error: (error) => {
        console.error('❌ Erreur lors de la création:', error);
        alert('Erreur lors de la création du keynote');
      }
    });
  }

  updateKeynote(): void {
    if (!this.isAdmin) {
      alert('❌ Seuls les administrateurs peuvent modifier des keynotes');
      return;
    }

    if (!this.editingKeynote?.id) return;

    this.keynoteService.updateKeynote(this.editingKeynote.id, this.newKeynote).subscribe({
      next: (keynote) => {
        const index = this.keynotes.findIndex(k => k.id === keynote.id);
        if (index !== -1) {
          this.keynotes[index] = keynote;
        }
        this.cancelEdit();
        console.log('✅ Keynote modifié avec succès');
      },
      error: (error) => {
        console.error('❌ Erreur lors de la modification:', error);
        alert('Erreur lors de la modification du keynote');
      }
    });
  }

  deleteKeynote(id: number): void {
    if (!this.isAdmin) {
      alert('❌ Seuls les administrateurs peuvent supprimer des keynotes');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce keynote ?')) {
      this.keynoteService.deleteKeynote(id).subscribe({
        next: () => {
          this.keynotes = this.keynotes.filter(k => k.id !== id);
          console.log('✅ Keynote supprimé avec succès');
        },
        error: (error) => {
          console.error('❌ Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression du keynote');
        }
      });
    }
  }

  editKeynote(keynote: Keynote): void {
    if (!this.isAdmin) {
      alert('❌ Seuls les administrateurs peuvent modifier des keynotes');
      return;
    }

    this.editingKeynote = keynote;
    this.newKeynote = { ...keynote };
  }

  cancelEdit(): void {
    this.editingKeynote = null;
    this.resetForm();
  }

  resetForm(): void {
    this.newKeynote = {
      nom: '',
      prenom: '',
      email: '',
      fonction: ''
    };
  }
}
