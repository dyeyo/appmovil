import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ListComponent } from 'src/app/components/list/list.component';
import { ToolbarComponent } from 'src/app/shared/toolbar/toolbar.component';
import { LoaderComponent } from 'src/app/shared/loader/loader.component';
import { FavoritosServices } from 'src/app/services/favoritos-services';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-favs',
  templateUrl: './favs.page.html',
  styleUrls: ['./favs.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    ListComponent,
    ToolbarComponent,
    CommonModule,
    LoaderComponent,
  ],
  providers: [FavoritosServices],
})
export class FavsPage implements OnInit {
  private services = inject(FavoritosServices);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  favorites: any[] = [];
  zoneId!: number;
  typeFilter!: string;
  neighborhoodFilter!: [{ neighborhood: string }];
  title = '';
  // loading = false;
  errorMsg = '';
  currentPage = 1;
  lastPage = 1;
  currentFilter: any = {}; // guarda el filtro usado en la última carga
  loadingMore = false;
  loadingFirst = true;
  private sub?: Subscription;

  constructor() {}

  ngOnInit() {
    // Escucha cambios globales para quitar/añadir en caliente
    this.sub = this.services.changed$.subscribe(({ id, isFav }) => {
      const idx = this.favorites.findIndex(
        (f) => f?.estate?.id === id || f?.id === id
      );

      if (!isFav && idx !== -1) {
        // Si dejaron de ser favorito, lo saco de la lista inmediatamente
        this.favorites.splice(idx, 1);
        // this.favorites = [...this.favorites]; // trigger de cambio
      }
    });
  }

  loadFavorites() {
    this.errorMsg = '';
    this.services.getMyFavs().subscribe({
      next: (res: any) => {
        this.favorites = res.map((r: any) => ({
          ...r.estate,
          favorites: true, // <— idem
        }));
      },
      error: () => {
        this.errorMsg = 'Error cargando inmuebles';
        this.loadingFirst = false;
        this.loadingMore = false;
      },
    });
  }

  ionViewWillEnter() {
    this.loadingFirst = true;
    this.services.getMyFavs().subscribe({
      next: (res: any) => {
        const arrayEstates = res.map((r: any) => ({
          ...r.estate,
          favorites: true, // <— Marca como favorito para pintar el corazón
        }));
        this.favorites = arrayEstates;
        this.loadingFirst = false;

        // this.favorites = (res.estate as any) ?? (res.estate as any) ?? [];
        // console.log(this.favorites);
      },
      error: () => (this.loadingFirst = false),
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.sub?.unsubscribe();
  }
}
