import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritosServices {
  private http = inject(HttpClient);

  // Emite cambios: { id, isFav }
  changed$ = new Subject<{ id: number; isFav: boolean }>();

  broadcastChange(id: number, isFav: boolean) {
    this.changed$.next({ id, isFav });
  }

  private getHeaders() {
    const t = localStorage.getItem('jwt'); // o desde Preferences
    return { Authorization: `Bearer ${t}` };
  }

  getMyFavs() {
    return this.http.get<{ data: any[] }>(`${environment.url_base}favorites/`, {
      headers: this.getHeaders(),
    });
  }

  handlerFavs(estateId: number) {
    return this.http.post<{ ok: boolean }>(
      `${environment.url_base}favorites/${estateId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  deleteFav(estateId: number) {
    return this.http.delete<{ ok: boolean }>(
      `${environment.url_base}favorites/${estateId}`,
      { headers: this.getHeaders() }
    );
  }
}
