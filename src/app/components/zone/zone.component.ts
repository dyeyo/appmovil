import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IonCard } from '@ionic/angular/standalone';
import * as L from 'leaflet';

type ZoneProps = { id: string; name: string; value: number };
type ZoneFeature = GeoJSON.Feature<GeoJSON.Polygon, ZoneProps>;

type Section = { id: number; name: string; points: [number, number][] };

const CENTER: [number, number] = [0.8272844347498653, -77.64216816776307]; // [lat,lng]
const ZOOM = 13;

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss'],
  standalone: true,
  imports: [IonCard],
})
export class ZoneComponent implements OnInit, AfterViewInit {
  @ViewChild('mapEl', { static: true }) mapEl!: ElementRef<HTMLDivElement>;

  @Input() dataMap: string = '';

  private pointLayer = L.layerGroup();
  private mapReady = false;

  private map!: L.Map;
  private group = L.featureGroup(); // aquí metemos todos los polígonos
  private ro?: ResizeObserver;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapEl.nativeElement, {
      preferCanvas: true,
      zoomControl: false, // oculta los botones +/-
      scrollWheelZoom: false, // desactiva rueda del mouse
      doubleClickZoom: false, // desactiva zoom por doble click
      touchZoom: false, // desactiva pinch zoom
      boxZoom: false, // desactiva Shift + arrastre
      keyboard: false, // desactiva +/- del teclado (también flechas)
      dragging: true,
    }).setView(CENTER, ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 25,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.group.clearLayers();
    this.pointLayer.addTo(this.map);
    this.mapReady = true;

    // si ya hay dato, pinto
    this.renderPointFromInput();

    requestAnimationFrame(() => this.map.invalidateSize());
    this.ro = new ResizeObserver(() => this.map.invalidateSize());
    this.ro.observe(this.mapEl.nativeElement);
  }

  ngOnInit(): void {
    this.renderPointFromInput();
  }

  ngOnChanges(ch: SimpleChanges): void {
    if (ch['dataMap'] && this.mapReady) {
      this.renderPointFromInput();
    }
  }

  getZone() {
    console.log(this.dataMap);
  }

  private renderPointFromInput() {
    const ll = this.extractLatLng(this.dataMap);
    if (!ll || !this.mapReady) return;

    this.pointLayer.clearLayers();

    const marker = L.circleMarker(ll, {
      radius: 40, // px
      weight: 2,
      color: '#1e88e5',
      fillColor: '#1e88e5',
      fillOpacity: 0.75,
    });

    const label = `${ll[0].toFixed(6)}, ${ll[1].toFixed(6)}`;

    marker.bindTooltip(label, { sticky: true });
    this.pointLayer.addLayer(marker);

    // centra y acerca al punto
    this.map.setView(ll, 16);
  }

  private extractLatLng(dm: any): [number, number] | null {
    if (!dm) return null;

    // 1) string "lat,lng"
    if (typeof dm === 'string') return this.parseLatLngString(dm);

    // 2) { lat, lng }
    if (typeof dm.lat === 'number' && typeof dm.lng === 'number') {
      return [dm.lat, dm.lng];
    }

    // 3) { point: "lat,lng" }
    if (typeof dm.point === 'string') return this.parseLatLngString(dm.point);

    // 4) { polygon: "lat,lng,[...]" } -> usa los 2 primeros números
    if (typeof dm.polygon === 'string') {
      const nums = dm.polygon.match(/-?\d+(\.\d+)?/g);
      if (nums && nums.length >= 2) {
        return [Number(nums[0]), Number(nums[1])];
      }
    }

    return null;
  }

  private parseLatLngString(s: string): [number, number] | null {
    const nums = s.match(/-?\d+(\.\d+)?/g);
    if (!nums || nums.length < 2) return null;
    const lat = Number(nums[0]);
    const lng = Number(nums[1]);
    return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
  }
}
