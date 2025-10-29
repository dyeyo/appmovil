import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { ActivatedRoute, RouterLink } from '@angular/router';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { EstatesService } from 'src/app/services/estates-service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from "@ionic/angular";
import { IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-more-post',
  templateUrl: './more-post.component.html',
  styleUrls: ['./more-post.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonCardTitle,
    IonCardContent,
    IonCardHeader,
    IonCard,
    RouterLink,
    CommonModule,
    IonText
],
})
export class MorePostComponent implements OnInit, AfterViewInit, OnDestroy {
  private _items: string[] = [];
  private innerDragging = false;
  @Input() title?: string = 'También te puede interesar';
  @Input() recent?: any = [];
  @Input() set items(value: string | string[]) {
    this._items = Array.isArray(value) ? value : value ? [value] : [];
    queueMicrotask(() => this.slider?.update());
  }
  get items() {
    return this._items;
  }
  @ViewChild('sliderRefCard', { static: true })
  sliderRefCard!: ElementRef<HTMLElement>;
  private slider?: KeenSliderInstance;
  private ro?: ResizeObserver;
  private services = inject(EstatesService);
  private route = inject(ActivatedRoute);
  data: any = [];
  errorMsg: string = '';

  constructor() {}

  ngOnInit() {
    this.loadEstates();
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

  loadEstates() {
    this.services.estatesRandom().subscribe({
      next: (res: any) => {
        this.data = res;
        queueMicrotask(() => this.slider?.update());
      },
      error: () => {
        this.errorMsg = 'Error cargando inmuebles';
      },
    });
  }
  onInnerStart(e: Event) {
    e.stopPropagation();
    this.innerDragging = true;
    this.slider?.update({
      ...this.slider?.options,
      drag: false,
    });
  }

  onInnerMove(e: Event) {
    if (this.innerDragging) e.stopPropagation();
  }

  onInnerEnd(e: Event) {
    e.stopPropagation();
    this.innerDragging = false;
    this.slider?.update({
      ...this.slider?.options,
      drag: true,
    });
  }

  ngOnDestroy() {
    this.ro?.disconnect();
    this.slider?.destroy();
  }
}
