import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Zones {
  private http = inject(HttpClient);

  searchByZone(zoneId: number) {
    const params = new HttpParams().set('zone_id', zoneId);
    return this.http.get<{ data: any[] }>(
      `${environment.url_base}estates/search`,
      { params }
    );
  }
}
