import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

const KEY = 'recent_viewed_estates';
const MAX = 5;

@Injectable({ providedIn: 'root' })
export class RecientEstatesService {
  private _recent$ = new BehaviorSubject<any[]>([]);
  recent$ = this._recent$.asObservable();

  constructor() {
    this.load();
  }

  /** Cargar desde storage y publicar (ordenado desc por viewedAt) */
  private async load() {
    const { value } = await Preferences.get({ key: KEY });
    const arr: any[] = value ? JSON.parse(value) : [];
    const sorted = arr
      .sort((a, b) => (b.viewedAt || 0) - (a.viewedAt || 0))
      .slice(0, MAX);
    this._recent$.next(sorted);
  }

  /** Forzar recarga desde storage */
  async refresh() {
    await this.load();
  }

  /** Obtener snapshot directo (útil para inicializar) */
  getSnapshot(): any[] {
    return this._recent$.value;
  }

  /** Leer todos desde storage (promesa) */
  async getAll(): Promise<any[]> {
    const { value } = await Preferences.get({ key: KEY });
    return value ? JSON.parse(value) : [];
  }

  /** Agregar/actualizar ítem visto (dedup + orden + tope 5) */
  async addViewed(input: any) {
    const curr = [...this._recent$.value];

    // Normaliza lo mínimo para que el HTML no rompa
    const normalized = {
      id: input.id,
      title: input.title ?? 'Inmueble',
      price: input.price ?? null,
      neighborhood: input.neighborhood ?? null,
      contrato: input.contrato ?? null,
      // Asegura images[] (tu carrusel lo usa)
      images:
        Array.isArray(input.images) && input.images.length
          ? input.images
          : input.thumbnail
          ? [input.thumbnail]
          : [],
      viewedAt: Date.now(),
    };

    // dedup por id
    const filtered = curr.filter((x) => x.id !== normalized.id);

    // ordena por viewedAt desc y recorta a 5
    const updated = [normalized, ...filtered]
      .sort((a, b) => (b.viewedAt || 0) - (a.viewedAt || 0))
      .slice(0, MAX);

    await Preferences.set({ key: KEY, value: JSON.stringify(updated) });
    this._recent$.next(updated);
  }

  /** Limpiar recientes */
  async clear() {
    await Preferences.remove({ key: KEY });
    this._recent$.next([]);
  }
}
