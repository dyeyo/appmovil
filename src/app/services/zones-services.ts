import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ZonesServices {
  private http = inject(HttpClient);

  getZonesMap() {
    return this.http.get<{ data: any[] }>(`${environment.url_base}zones`);
  }
}
