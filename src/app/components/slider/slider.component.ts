import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import {
  IonCardTitle,
  IonCard,
  IonCardHeader,
} from '@ionic/angular/standalone';

export type CardItem = {
  title: string;
  subtitle?: string;
  badge?: string;
  img?: string;
};

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SliderComponent implements AfterViewInit, OnDestroy {
  private _items: string[] = [];
  @Input() set items(value: string | any[]) {
    this._items = Array.isArray(value) ? value : value ? [value] : [];
    // actualiza el slider si ya existe
    queueMicrotask(() => this.slider?.update());
  }
  get items() {
    return this._items;
  }

  @ViewChild('sliderRef', { static: true }) sliderRef!: ElementRef<HTMLElement>;
  private slider?: KeenSliderInstance;
  private ro?: ResizeObserver;

  ngAfterViewInit() {
    this.slider = new KeenSlider(this.sliderRef.nativeElement, {
      slides: { perView: 1.1, spacing: 12 },
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
    this.ro.observe(this.sliderRef.nativeElement);
  }

  ngOnDestroy() {
    this.ro?.disconnect();
    this.slider?.destroy();
  }
}
