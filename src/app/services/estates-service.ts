import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EstatesService {
  private http = inject(HttpClient);

  searchEstatesByFilters(filters: any = {}, page = 1) {
    let params = new HttpParams().set('page', page);
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') {
        params = params.set(k, String(v)); // ✅ incluye neighborhood
      }
    });
    return this.http.get<{
      data: any[];
      current_page: number;
      last_page: number;
      total: number;
    }>(`${environment.url_base}estates/search`, { params });
  }

  searchByZone(zoneId: number, page = 1) {
    const params = new HttpParams()
      .set('page', page)
      .set('zone_id', String(zoneId));
    return this.http.get<{ data: any[]; meta: any }>(
      `${environment.url_base}estates/search`,
      { params }
    );
  }

  estatesRandom() {
    return this.http.get<{ data: any[]; meta: any }>(`${environment.url_base}estates/random`);
  }

  private expandExtras(p: any) {
    if (!Array.isArray(p?.extras)) return p;
    const flags = (p.extras as string[]).reduce((acc, key) => {
      (acc as any)[key] = 1; // o true
      return acc;
    }, {} as Record<string, number>);
    const { extras, ...rest } = p;
    return { ...rest, ...flags };
  }

  private toHttpParams(obj: Record<string, any>): HttpParams {
    let params = new HttpParams();
    for (const k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
      const v = obj[k];
      if (v === null || v === undefined || v === '') continue; // omite vacíos
      if (Array.isArray(v))
        v.forEach((val) => (params = params.append(k, String(val))));
      else params = params.set(k, String(v));
    }
    return params;
  }

  getDetail(estateId: number) {
    return this.http.get<{ data: any[] }>(
      `${environment.url_base}estates/${estateId}`
    );
  }
}
