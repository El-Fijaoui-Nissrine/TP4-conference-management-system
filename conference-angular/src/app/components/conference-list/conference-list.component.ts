import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conference, ConferenceDTO, Review } from '../../models/conference.model';
import { Keynote } from '../../models/keynote.model';
import { ConferenceService } from '../../services/conference.service';
import { KeynoteService } from '../../services/keynote.service';

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

  // Ajoutez un état de chargement
  isLoading = false;
  errorMessage = '';

  constructor(
    private conferenceService: ConferenceService,
    private keynoteService: KeynoteService
  ) {
    console.log('🔧 ConferenceListComponent initialized');
  }

  ngOnInit(): void {
    console.log('🔄 Initializing ConferenceListComponent...');
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('🔄 Loading initial data...');

    // Chargez d'abord les keynotes, puis les conférences
    this.keynoteService.getAllKeynotes().subscribe({
      next: (keynotes) => {
        console.log('✅ Keynotes loaded successfully:', keynotes);
        this.allKeynotes = keynotes;

        // Maintenant chargez les conférences
        this.conferenceService.getAllConferences().subscribe({
          next: (conferences) => {
            console.log('✅ Conferences loaded successfully:', conferences);
            this.conferences = conferences;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('❌ Error loading conferences:', error);
            this.errorMessage = 'Erreur lors du chargement des conférences';
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('❌ Error loading keynotes:', error);
        this.errorMessage = 'Erreur lors du chargement des keynotes';
        this.isLoading = false;

        // Essayez quand même de charger les conférences
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
    this.newConference.keynoteIds = this.selectedKeynoteIds;
    this.conferenceService.createConference(this.newConference).subscribe({
      next: (conference) => {
        this.conferences.push(conference);
        this.resetForm();
      },
      error: (error) => console.error('Erreur lors de la création:', error)
    });
  }

  updateConference(): void {
    if (!this.editingConference?.id) return;

    this.newConference.keynoteIds = this.selectedKeynoteIds;
    this.conferenceService.updateConference(this.editingConference.id, this.newConference).subscribe({
      next: (conference) => {
        const index = this.conferences.findIndex(c => c.id === conference.id);
        if (index !== -1) {
          this.conferences[index] = conference;
        }
        this.cancelEdit();
      },
      error: (error) => console.error('Erreur lors de la modification:', error)
    });
  }

  deleteConference(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette conférence ?')) {
      this.conferenceService.deleteConference(id).subscribe({
        next: () => {
          this.conferences = this.conferences.filter(c => c.id !== id);
          if (this.selectedConference?.id === id) {
            this.selectedConference = null;
          }
        },
        error: (error) => console.error('Erreur lors de la suppression:', error)
      });
    }
  }

  editConference(conference: Conference): void {
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
      error: (error) => console.error('Erreur lors du chargement des keynotes:', error)
    });
  }

  loadConferenceReviews(conferenceId: number): void {
    this.conferenceService.getConferenceReviews(conferenceId).subscribe({
      next: (reviews) => this.conferenceReviews = reviews,
      error: (error) => console.error('Erreur lors du chargement des avis:', error)
    });
  }

  addReview(): void {
    if (!this.selectedConference?.id) return;

    this.conferenceService.addReviewToConference(this.selectedConference.id, this.newReview).subscribe({
      next: (review) => {
        this.conferenceReviews.push(review);
        this.newReview = { date: new Date(), texte: '', stars: 0 };
      },
      error: (error) => console.error('Erreur lors de l\'ajout de l\'avis:', error)
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
