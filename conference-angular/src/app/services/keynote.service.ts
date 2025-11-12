import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Keynote } from '../models/keynote.model';

@Injectable({
  providedIn: 'root'
})
export class KeynoteService {
  // Avant :
  // private apiUrl = 'http://localhost:8085/api/keynotes';
  // Maintenant via Gateway :
  private apiUrl = 'http://localhost:8888/keynote-service/api/keynotes';

  constructor(private http: HttpClient) {
    console.log('🔧 KeynoteService initialized with Gateway URL:', this.apiUrl);
  }

  getAllKeynotes(): Observable<Keynote[]> {
    console.log('🔄 Fetching all keynotes via Gateway from:', this.apiUrl);
    return this.http.get<Keynote[]>(this.apiUrl).pipe(
      tap(keynotes => console.log('✅ Keynotes received:', keynotes)),
      catchError(error => {
        console.error('❌ Error fetching keynotes:', error);
        return [];
      })
    );
  }

  getKeynoteById(id: number): Observable<Keynote> {
    return this.http.get<Keynote>(`${this.apiUrl}/${id}`);
  }

  createKeynote(keynote: Keynote): Observable<Keynote> {
    console.log('🔄 Creating keynote:', keynote);
    return this.http.post<Keynote>(this.apiUrl, keynote).pipe(
      tap(created => console.log('✅ Keynote created:', created))
    );
  }

  updateKeynote(id: number, keynote: Keynote): Observable<Keynote> {
    return this.http.put<Keynote>(`${this.apiUrl}/${id}`, keynote);
  }

  deleteKeynote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
