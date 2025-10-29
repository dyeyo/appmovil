import { Component, inject, OnInit } from '@angular/core';
import { ListComponent } from 'src/app/components/list/list.component';
import {
  IonContent,
  InfiniteScrollCustomEvent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { ToolbarComponent } from 'src/app/shared/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { EstatesService } from 'src/app/services/estates-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoaderComponent } from 'src/app/shared/loader/loader.component';
import { ModalFilterComponent } from 'src/app/components/modal-filter/modal-filter.component';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  Subject,
  switchMap,
  takeUntil,
  of,
  tap,
} from 'rxjs';
type ModalPayload = {
  filters: any;
  data: any[];
  meta?: { current_page: number; last_page: number; total: number };
  current_page?: number;
  last_page?: number;
  total?: number; // por si no viene meta
};
@Component({
  selector: 'app-list-zone',
  templateUrl: './list-zone.component.html',
  styleUrls: ['./list-zone.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    ListComponent,
    ToolbarComponent,
    CommonModule,
    LoaderComponent,
    ModalFilterComponent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  providers: [EstatesService],
})
export class ListZoneComponent implements OnInit {
  private services = inject(EstatesService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  estates: any[] = [];
  zoneId!: number;
  typeFilter!: string;
  neighborhoodFilter!: [{ neighborhood: string }];
  title = '';
  // loading = false;
  errorMsg = '';
  currentPage = 1;
  lastPage = 1;
  currentFilter: any = {}; // guarda el filtro usado en la última carga
  loadingFirst = false; // solo para la página 1
  loadingMore = false;

  constructor() {}

  ngOnInit() {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        // 1) Construye un objeto de parámetros único
        map(([p, q]) => {
          const zoneId = +(q.get('zone_id') ?? p.get('id') ?? '0');
          const type = (q.get('type') ?? p.get('type') ?? '').trim();
          const neighborhood = (
            q.get('neighborhood') ??
            p.get('neighborhood') ??
            ''
          ).trim();
          return { zoneId, type, neighborhood };
        }),
        // 2) Evita dobles emisiones iguales (por timing de Angular Router)
        distinctUntilChanged(
          (a, b) =>
            a.zoneId === b.zoneId &&
            a.type === b.type &&
            a.neighborhood === b.neighborhood
        ),
        // 3) Resetea la paginación una sola vez por cambio real
        tap(() => this.resetPaging()),
        // 4) Carga la página 1; switchMap cancela si llega otro cambio
        switchMap(({ zoneId, type, neighborhood }) => {
          if (zoneId) {
            this.currentFilter = { zone_id: zoneId };
            return this.services.searchByZone(zoneId, 1);
          }
          if (type && type !== 'neighborhood') {
            this.currentFilter = { contrato: type };
            return this.services.searchEstatesByFilters(this.currentFilter, 1);
          }
          if (neighborhood) {
            this.currentFilter = { neighborhood };
            return this.services.searchEstatesByFilters(this.currentFilter, 1);
          }
          // Sin filtros: no pidas nada
          return of({ data: [], current_page: 1, last_page: 1, total: 0 });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          const { cp, lp, total } = this.readPages(res, 1);
          this.currentPage = cp;
          this.lastPage = lp;

          // Título según el filtro activo
          if (this.currentFilter?.zone_id)
            this.title = `Zona ${this.currentFilter.zone_id}`;
          else if (this.currentFilter?.contrato)
            this.title = `Propiedades en ${this.currentFilter.contrato} (${
              total || res.data?.length || 0
            })`;
          else if (this.currentFilter?.neighborhood)
            this.title = `Barrio: ${this.currentFilter.neighborhood} (${
              total || res.data?.length || 0
            })`;
          else this.title = 'Propiedades';

          this.estates = res.data ?? [];
          this.loadingFirst = false;
          this.loadingMore = false;
        },
        error: () => {
          this.errorMsg = 'Error cargando inmuebles';
          this.loadingFirst = false;
          this.loadingMore = false;
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private resetPaging() {
    this.estates = [];
    this.currentPage = 1;
    this.lastPage = 1;
    this.loadingFirst = true;
    this.loadingMore = false;
  }

  loadEstates(zoneId: number, page = 1) {
    this.errorMsg = '';
    if (page === 1) this.loadingFirst = true;

    this.currentFilter = { zone_id: zoneId };
    this.services.searchByZone(zoneId, page).subscribe({
      next: (res) => {
        console.log(res);
        const { cp, lp } = this.readPages(res as any, page);
        this.currentPage = cp;
        this.lastPage = lp;
        this.title = `Zona ${zoneId}`;
        this.estates = [...this.estates, ...(res.data ?? [])];
        this.loadingFirst = false; // apaga skeleton solo en la 1ra carga
        this.loadingMore = false; // por si venía del infinite
      },
      error: () => {
        this.errorMsg = 'Error cargando inmuebles';
        this.loadingFirst = false;
        this.loadingMore = false;
      },
    });
  }

  loadEstatesByType(typeEstate: string, page = 1) {
    this.loadingFirst = true;
    this.errorMsg = '';
    this.currentFilter = { contrato: typeEstate };
    this.services.searchEstatesByFilters(this.currentFilter, page).subscribe({
      next: (res: any) => {
        this.loadingFirst = false;
        this.title = `Propiedades en ${typeEstate} (${
          res.total ?? res.data?.length ?? 0
        })`;
        this.currentPage = res.current_page ?? page;
        this.lastPage = res.last_page ?? page;
        this.estates = [...this.estates, ...(res.data ?? [])];
      },
      error: () => {
        this.errorMsg = 'Error cargando inmuebles';
        this.loadingFirst = false;
      },
    });
  }

  loadEstatesByNeighborhood(neighborhood: string, page = 1) {
    this.loadingFirst = page === 1;
    this.errorMsg = '';
    this.currentFilter = { neighborhood }; // ✅ el infinite usará este filtro

    this.services.searchEstatesByFilters(this.currentFilter, page).subscribe({
      next: (res: any) => {
        const { cp, lp, total } = this.readPages(res, page);
        this.currentPage = cp;
        this.lastPage = lp;
        this.title = `Barrio: ${neighborhood} (${
          total || res.data?.length || 0
        })`;
        // página 1 reemplaza; en scroll se acumula
        this.estates =
          page === 1 ? res.data ?? [] : [...this.estates, ...(res.data ?? [])];
        this.loadingFirst = false;
        this.loadingMore = false;
      },
      error: () => {
        this.errorMsg = 'Error cargando inmuebles';
        this.loadingFirst = false;
        this.loadingMore = false;
      },
    });
  }

  // Recibir resultados desde el modal (si aplicara) y resetear paginación:
  loadEstatesFilters(estatesFilter: any) {
    this.resetPaging();
    console.log(estatesFilter);
    this.currentFilter = estatesFilter.filters || {};

    const { cp, lp, total } = this.readPages(estatesFilter, 1);
    this.currentPage = cp;
    this.lastPage = lp;
    this.title = `Resultados (${total || estatesFilter.data?.length || 0})`;
    this.estates = estatesFilter.data ?? [];
    this.loadingFirst = false;
  }

  // INFINITE SCROLL:
  onIonInfinite(event: InfiniteScrollCustomEvent) {
    const target = event.target as HTMLIonInfiniteScrollElement;

    if (this.currentPage >= this.lastPage) {
      target.disabled = true;
      target.complete();
      return;
    }

    this.loadingMore = true; // activa spinner del infinite
    const nextPage = this.currentPage + 1;

    const finalize = () => {
      this.loadingMore = false;
      target.complete();
      if (this.currentPage >= this.lastPage) target.disabled = true;
    };

    const sub = (obs: any) =>
      obs.subscribe({
        next: (res: any) => {
          const { cp, lp } = this.readPages(res, nextPage);
          this.currentPage = cp;
          this.lastPage = lp;
          this.estates = [...this.estates, ...(res.data ?? [])];
          finalize();
        },
        error: () => {
          this.errorMsg = 'Error cargando más inmuebles';
          finalize();
        },
      });

    if (this.currentFilter?.zone_id) {
      sub(this.services.searchByZone(this.currentFilter.zone_id, nextPage));
    } else {
      sub(
        this.services.searchEstatesByFilters(this.currentFilter || {}, nextPage)
      );
    }
  }

  private readPages(res: any, fallbackPage: number) {
    const cp =
      (res as any).meta?.current_page ??
      (res as any).current_page ??
      fallbackPage;
    const lp = (res as any).meta?.last_page ?? (res as any).last_page ?? cp;
    const total = (res as any).meta?.total ?? (res as any).total ?? 0;
    return { cp, lp, total };
  }
}
