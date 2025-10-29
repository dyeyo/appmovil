import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { RecientEstatesService } from 'src/app/services/recient-estates-services';
import { IonicModule } from '@ionic/angular';
import { IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-recient-estes',
  standalone: true,
  templateUrl: './recient-estes.component.html',
  styleUrls: ['./recient-estes.component.scss'],
  imports: [
    CommonModule,
    RouterLink,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonIcon,
    IonText
],
})
export class RecientEstesComponent implements OnInit, AfterViewInit, OnDestroy {
  private recentSvc = inject(RecientEstatesService);

  // === MISMAS APIS PÚBLICAS QUE usa more-post ===
  data: any[] = []; // <-- aquí van los 5 recientes
  errorMsg = '';
  title = 'Vistos recientemente';

  @ViewChild('sliderRefCard', { static: true })
  sliderRefCard!: ElementRef<HTMLElement>;
  private slider?: KeenSliderInstance;
  private ro?: ResizeObserver;

  // Estado para la galería interna (igual que more-post)
  private innerDragging = false;

  async ngOnInit() {
    // 1) Trae del cache y llena data
    await this.recentSvc.refresh();
    this.data = (await this.recentSvc.getAll()).slice(0, 5);
    queueMicrotask(() => this.slider?.update());

    // 2) Reactivo: si se agrega un nuevo visto reciente, actualiza carrusel
    this.recentSvc.recent$.subscribe((arr) => {
      this.data = (arr ?? []).slice(0, 5);
      queueMicrotask(() => this.slider?.update());
    });
  }

  ngAfterViewInit() {
    this.slider = new KeenSlider(this.sliderRefCard.nativeElement, {
      slides: { perView: 1.2, spacing: 15 },
      drag: true,
      mode: 'free-snap',
      rubberband: true,
      renderMode: 'performance',
      breakpoints: {
        '(min-width: 640px)': { slides: { perView: 1.4, spacing: 14 } },
        '(min-width: 768px)': { slides: { perView: 2.1, spacing: 16 } },
        '(min-width: 1024px)': { slides: { perView: 3.1, spacing: 18 } },
      },
    });

    this.ro = new ResizeObserver(() => this.slider?.update());
    this.ro.observe(this.sliderRefCard.nativeElement);
  }

  ngOnDestroy() {
    this.ro?.disconnect();
    this.slider?.destroy();
  }

  // Handlers internos (igual que tu more-post)
  onInnerStart(e: Event) {
    e.stopPropagation();
    this.innerDragging = true;
    this.slider?.update({ ...this.slider?.options, drag: false });
  }
  onInnerMove(e: Event) {
    if (this.innerDragging) e.stopPropagation();
  }
  onInnerEnd(e: Event) {
    e.stopPropagation();
    this.innerDragging = false;
    this.slider?.update({ ...this.slider?.options, drag: true });
  }
}
