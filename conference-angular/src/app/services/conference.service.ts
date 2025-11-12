import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Conference, ConferenceDTO, Review } from '../models/conference.model';
import { Keynote } from '../models/keynote.model';
@Injectable({
  providedIn: 'root'
})
export class ConferenceService {
  // Avant :
  // private apiUrl = 'http://localhost:8087/api/conferences';
  // Maintenant via Gateway :
  private apiUrl = 'http://localhost:8888/conference-service/api/conferences';

  constructor(private http: HttpClient) {
    console.log('🔧 ConferenceService initialized with Gateway URL:', this.apiUrl);
  }

  getAllConferences(): Observable<Conference[]> {
    console.log('🔄 Fetching all conferences via Gateway from:', this.apiUrl);
    return this.http.get<Conference[]>(this.apiUrl).pipe(
      tap(conferences => console.log('✅ Conferences received:', conferences)),
      catchError(error => {
        console.error('❌ Error fetching conferences:', error);
        return [];
      })
    );
  }

  getConferenceById(id: number): Observable<Conference> {
    return this.http.get<Conference>(`${this.apiUrl}/${id}`);
  }

  createConference(conference: ConferenceDTO): Observable<Conference> {
    console.log('🔄 Creating conference:', conference);
    return this.http.post<Conference>(this.apiUrl, conference).pipe(
      tap(created => console.log('✅ Conference created:', created))
    );
  }

  updateConference(id: number, conference: ConferenceDTO): Observable<Conference> {
    return this.http.put<Conference>(`${this.apiUrl}/${id}`, conference);
  }

  deleteConference(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getConferenceReviews(conferenceId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${conferenceId}/reviews`);
  }

  addReviewToConference(conferenceId: number, review: Review): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/${conferenceId}/reviews`, review);
  }

  getConferenceKeynotes(conferenceId: number): Observable<Keynote[]> {
    const url = `${this.apiUrl}/${conferenceId}/keynotes`;
    console.log('🔄 Fetching conference keynotes from:', url);
    return this.http.get<Keynote[]>(url).pipe(
      tap(keynotes => console.log('✅ Conference keynotes received:', keynotes)),
      catchError(error => {
        console.error('❌ Error fetching conference keynotes:', error);
        console.error('Error details:', error.message, error.status, error.url);
        return [];
      })
    );
  }
}
