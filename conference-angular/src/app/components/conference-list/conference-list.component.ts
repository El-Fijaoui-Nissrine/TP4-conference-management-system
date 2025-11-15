import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conference, ConferenceDTO, Review } from '../../models/conference.model';
import { Keynote } from '../../models/keynote.model';
import { ConferenceService } from '../../services/conference.service';
import { KeynoteService } from '../../services/keynote.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-conference-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conference-list.component.html',
  styleUrls: ['./conference-list.component.css']
})
export class ConferenceListComponent implements OnInit {
  conferences: Conference[] = [];
  allKeynotes: Keynote[] = [];
  conferenceKeynotes: Keynote[] = [];
  conferenceReviews: Review[] = [];
  selectedConference: Conference | null = null;
  editingConference: Conference | null = null;

  newConference: ConferenceDTO = {
    titre: '',
    type: '',
    date: new Date(),
    duree: 0,
    nbInscrits: 0,
    score: 0,
    keynoteIds: []
  };

  newReview: Review = {
    date: new Date(),
    texte: '',
    stars: 0
  };

  selectedKeynoteIds: number[] = [];
  isLoading = false;
  errorMessage = '';

  // Gestion des rôles
  isAdmin = false;
  canEdit = false;

  constructor(
    private conferenceService: ConferenceService,
    private keynoteService: KeynoteService,
    private keycloakService: KeycloakService
  ) {
    console.log('🔧 ConferenceListComponent initialized');
  }

  async ngOnInit() {
    console.log('🔄 Initializing ConferenceListComponent...');

    // Vérifier les rôles de l'utilisateur
    const roles = this.keycloakService.getUserRoles();
    this.isAdmin = roles.includes('ADMIN');
    this.canEdit = this.isAdmin || roles.includes('USER');

    console.log('👤 User roles:', roles);
    console.log('🔐 Is Admin:', this.isAdmin);

    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('🔄 Loading initial data...');

    this.keynoteService.getAllKeynotes().subscribe({
      next: (keynotes) => {
        console.log('✅ Keynotes loaded successfully:', keynotes);
        this.allKeynotes = keynotes;

        this.conferenceService.getAllConferences().subscribe({
          next: (conferences) => {
            console.log('✅ Conferences loaded successfully:', conferences);
            this.conferences = conferences;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('❌ Error loading conferences:', error);
            this.errorMessage = 'Erreur lors du chargement des conférences. Vérifiez votre connexion.';
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('❌ Error loading keynotes:', error);
        this.errorMessage = 'Erreur lors du chargement des keynotes. Vérifiez votre connexion.';
        this.isLoading = false;

        this.conferenceService.getAllConferences().subscribe({
          next: (conferences) => {
            this.conferences = conferences;
          },
          error: (err) => {
            console.error('❌ Error loading conferences after keynote error:', err);
          }
        });
      }
    });
  }

  createConference(): void {
    if (!this.isAdmin) {
      alert('❌ Seuls les administrateurs peuvent créer des conférences');
      return;
    }

    this.newConference.keynoteIds = this.selectedKeynoteIds;
    this.conferenceService.createConference(this.newConference).subscribe({
      next: (conference) => {
        this.conferences.push(conference);
        this.resetForm();
        console.log('✅ Conférence créée avec succès');
      },
      error: (error) => {
        console.error('❌ Erreur lors de la création:', error);
        alert('Erreur lors de la création de la conférence');
      }
    });
  }

  updateConference(): void {
    if (!this.isAdmin) {
      alert('❌ Seuls les administrateurs peuvent modifier des conférences');
      return;
    }

    if (!this.editingConference?.id) return;

    this.newConference.keynoteIds = this.selectedKeynoteIds;
    this.conferenceService.updateConference(this.editingConference.id, this.newConference).subscribe({
      next: (conference) => {
        const index = this.conferences.findIndex(c => c.id === conference.id);
        if (index !== -1) {
          this.conferences[index] = conference;
        }
        this.cancelEdit();
        console.log('✅ Conférence modifiée avec succès');
      },
      error: (error) => {
        console.error('❌ Erreur lors de la modification:', error);
        alert('Erreur lors de la modification de la conférence');
      }
    });
  }

  deleteConference(id: number): void {
    if (!this.isAdmin) {
      alert('❌ Seuls les administrateurs peuvent supprimer des conférences');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cette conférence ?')) {
      this.conferenceService.deleteConference(id).subscribe({
        next: () => {
          this.conferences = this.conferences.filter(c => c.id !== id);
          if (this.selectedConference?.id === id) {
            this.selectedConference = null;
          }
          console.log('✅ Conférence supprimée avec succès');
        },
        error: (error) => {
          console.error('❌ Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de la conférence');
        }
      });
    }
  }

  editConference(conference: Conference): void {
    if (!this.isAdmin) {
      alert('❌ Seuls les administrateurs peuvent modifier des conférences');
      return;
    }

    this.editingConference = conference;
    this.newConference = { ...conference };
    this.selectedKeynoteIds = [...conference.keynoteIds];
  }

  cancelEdit(): void {
    this.editingConference = null;
    this.resetForm();
  }

  showConferenceDetails(conference: Conference): void {
    this.selectedConference = conference;
    this.loadConferenceKeynotes(conference.id!);
    this.loadConferenceReviews(conference.id!);
  }

  loadConferenceKeynotes(conferenceId: number): void {
    this.conferenceService.getConferenceKeynotes(conferenceId).subscribe({
      next: (keynotes) => this.conferenceKeynotes = keynotes,
      error: (error) => console.error('❌ Erreur lors du chargement des keynotes:', error)
    });
  }

  loadConferenceReviews(conferenceId: number): void {
    this.conferenceService.getConferenceReviews(conferenceId).subscribe({
      next: (reviews) => this.conferenceReviews = reviews,
      error: (error) => console.error('❌ Erreur lors du chargement des avis:', error)
    });
  }

  addReview(): void {
    if (!this.selectedConference?.id) return;

    this.conferenceService.addReviewToConference(this.selectedConference.id, this.newReview).subscribe({
      next: (review) => {
        this.conferenceReviews.push(review);
        this.newReview = { date: new Date(), texte: '', stars: 0 };
        console.log('✅ Avis ajouté avec succès');
      },
      error: (error) => {
        console.error('❌ Erreur lors de l\'ajout de l\'avis:', error);
        alert('Erreur lors de l\'ajout de l\'avis');
      }
    });
  }

  toggleKeynoteSelection(keynoteId: number): void {
    const index = this.selectedKeynoteIds.indexOf(keynoteId);
    if (index === -1) {
      this.selectedKeynoteIds.push(keynoteId);
    } else {
      this.selectedKeynoteIds.splice(index, 1);
    }
  }

  resetForm(): void {
    this.newConference = {
      titre: '',
      type: '',
      date: new Date(),
      duree: 0,
      nbInscrits: 0,
      score: 0,
      keynoteIds: []
    };
    this.selectedKeynoteIds = [];
  }
}
