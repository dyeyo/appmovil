import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonIcon,
  IonItem,
  IonLabel,
  IonButton,
  IonAccordionGroup,
  IonAccordion,
  IonCardTitle,
  IonCardSubtitle,
  IonContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline, shareSocialOutline } from 'ionicons/icons';
import { KeenSliderInstance } from 'keen-slider';
import KeenSlider from 'keen-slider';

import { MapComponent } from '../map/map.component';
import { MorePostComponent } from '../more-post/more-post.component';
import { ZonesServices } from '../../services/zones-services';
import { ZoneComponent } from '../zone/zone.component';
import { FavoritosServices } from 'src/app/services/favoritos-services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  imports: [
    IonCardSubtitle,
    IonCardTitle,
    IonAccordion,
    IonAccordionGroup,
    IonButton,
    IonLabel,
    IonItem,
    IonIcon,
    IonCard,
    IonCol,
    IonRow,
    IonRow,
    MorePostComponent,
    CommonModule,
    ZoneComponent,
  ],
  providers: [ZonesServices],
})
export class DetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(IonContent, { static: true }) content!: IonContent;
  private _items: string[] = [];

  @Input() detail: any;

  @Input() set items(value: string | string[]) {
    this._items = Array.isArray(value) ? value : value ? [value] : [];
    queueMicrotask(() => this.slider?.update());
  }

  private service = inject(ZonesServices);
  private serviceFav = inject(FavoritosServices);

  get items() {
    return this._items;
  }

  @ViewChild('sliderRef', { static: true }) sliderRef!: ElementRef<HTMLElement>;

  private slider?: KeenSliderInstance;
  private ro?: ResizeObserver;
  dataMap: [] = [];
  errorMsg: string = '';
  loading: boolean = false;
  urlBase: string = environment.url_base_file;
  
  constructor() {
    addIcons({
      heartOutline,
      shareSocialOutline,
    });
  }
  ngOnInit(): void {}

  async ngAfterViewInit() {
    this.slider = new KeenSlider(this.sliderRef.nativeElement, {
      slides: { perView: 1, spacing: 12 },
      drag: true,
      mode: 'free-snap',
      rubberband: true,
      renderMode: 'performance',
      breakpoints: {
        '(min-width: 640px)': { slides: { perView: 1, spacing: 0 } },
        '(min-width: 768px)': { slides: { perView: 1, spacing: 0 } },
        '(min-width: 1024px)': { slides: { perView: 1, spacing: 0 } },
      },
    });

    this.ro = new ResizeObserver(() => this.slider?.update());
    this.ro.observe(this.sliderRef.nativeElement);
  }

  toggleFav(item: any, ev?: Event) {
    ev?.stopPropagation();
    ev?.preventDefault();

    const prev = !!item.favorites; // estado anterior
    const next = !prev; // estado nuevo

    // Optimista: cambia ya
    item.favorites = next;

    // Notifica a toda la app (pág. Favoritos, listados, etc.)
    this.serviceFav.broadcastChange(item.id, next);

    // Llama API según el estado deseado
    const req$ = next
      ? this.serviceFav.handlerFavs(item.id)
      : this.serviceFav.deleteFav(item.id);

    req$.subscribe({
      next: () => {},
      error: (err) => {
        console.error(err);
        // Revertir todo si falla
        item.favorites = prev;
        this.serviceFav.broadcastChange(item.id, prev);
      },
    });
  }

  ngOnDestroy() {
    this.ro?.disconnect();
    this.slider?.destroy();
  }
}
