import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Keynote } from '../../models/keynote.model';
import { KeynoteService } from '../../services/keynote.service';

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

  constructor(private keynoteService: KeynoteService) {}

  ngOnInit(): void {
    this.loadKeynotes();
  }

  loadKeynotes(): void {
    this.keynoteService.getAllKeynotes().subscribe({
      next: (data) => this.keynotes = data,
      error: (error) => console.error('Erreur lors du chargement des keynotes:', error)
    });
  }

  createKeynote(): void {
    this.keynoteService.createKeynote(this.newKeynote).subscribe({
      next: (keynote) => {
        this.keynotes.push(keynote);
        this.resetForm();
      },
      error: (error) => console.error('Erreur lors de la création:', error)
    });
  }

  updateKeynote(): void {
    if (!this.editingKeynote?.id) return;

    this.keynoteService.updateKeynote(this.editingKeynote.id, this.newKeynote).subscribe({
      next: (keynote) => {
        const index = this.keynotes.findIndex(k => k.id === keynote.id);
        if (index !== -1) {
          this.keynotes[index] = keynote;
        }
        this.cancelEdit();
      },
      error: (error) => console.error('Erreur lors de la modification:', error)
    });
  }

  deleteKeynote(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce keynote ?')) {
      this.keynoteService.deleteKeynote(id).subscribe({
        next: () => {
          this.keynotes = this.keynotes.filter(k => k.id !== id);
        },
        error: (error) => console.error('Erreur lors de la suppression:', error)
      });
    }
  }

  editKeynote(keynote: Keynote): void {
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
