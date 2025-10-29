import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { IonContent, IonCard, IonButton } from '@ionic/angular/standalone';
import * as L from 'leaflet';

type ZoneProps = { id: string; name: string; value: number };
type ZoneFeature = GeoJSON.Feature<GeoJSON.Polygon, ZoneProps>;

type Section = { id: number; name: string; points: [number, number][] };

const CENTER: [number, number] = [0.8272844347498653, -77.64216816776307]; // [lat,lng]
const ZOOM = 13;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [IonCard],
})
export class MapComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('mapEl', { static: true }) mapEl!: ElementRef<HTMLDivElement>;

  @Input() dataMap:any[] = [];
  @Output() zoneSelected = new EventEmitter<{ id: number; name: string }>();

  private map!: L.Map;
  private group = L.featureGroup(); // aquí metemos todos los polígonos
  private ro?: ResizeObserver;

  // Tus puntos (en el mismo orden que enviaste). Formato [lat, lng].
  private static readonly ZONES: Section[] = [
    {
      id: 1,
      name: 'Zona 1',
      points: [
        [0.8331847222847717, -77.64574420753128],
        [0.8308067447294003, -77.64077988559565],
        [0.8305005615533858, -77.63608460269094],
        [0.8298371774847478, -77.62832729935003],
        [0.8296330540617013, -77.62434653554538],
        [0.829326868259577, -77.61926859298936],
        [0.8286379738754064, -77.608321487399],
        [0.8316742496920485, -77.60252898644423],
        [0.8337409587200292, -77.60007927870721],
        [0.8361138610563218, -77.5970681429916],
        [0.8356345945593447, -77.6119161800375],
        [0.836575220845793, -77.62372069133997],
        [0.8397005211850525, -77.63185332995546],
        [0.8390936715441372, -77.63488792558765],
        [0.839063319841122, -77.63816524992002],
        [0.8362950844563349, -77.64210703904055],
        [0.8352444200656898, -77.64526139179432], // FIN (cierre)
      ],
    },
    {
      id: 2,
      name: 'Zona 2',
      // Usa las coordenadas de la PRIMERA zona que ya pintaste (las mismas que usaste antes):
      points: [
        [0.8360254156966357, -77.59710654791343],
        [0.8334890709187109, -77.59776528184663],
        [0.8238635583452394, -77.59973042695782],
        [0.8238199277030647, -77.61168748971923],
        [0.8197540111308248, -77.61457035224362],
        [0.8134276627786896, -77.59989992189665],
        [0.8134276627786896, -77.59989992189665],
        [0.8130194491878168, -77.61255679568738],
        [0.8169998339088189, -77.61929347675705],
        [0.8194492373055349, -77.62659146367677],
        [0.8225621010093667, -77.63225642118287],
        [0.8267975929837414, -77.63205227267856],
        [0.8299104314117626, -77.63230744022724],
        [0.829196001097046, -77.62470320507671],
        [0.8284926844438741, -77.6085126669191],
      ],
    },

    {
      id: 3,
      name: 'Zona 3',
      // Usa las coordenadas de la PRIMERA zona que ya pintaste (las mismas que usaste antes):
      points: [
        [0.8299837654313196, -77.63220201954668],
        [0.826420208225942, -77.63217840510738],
        [0.8225039325994928, -77.63245095642098],
        [0.8200977558853882, -77.62886644940394],
        [0.8182233427815587, -77.63267855034859],
        [0.8173282410986713, -77.63947601429842],
        [0.8204195000772118, -77.63949767287096],
        [0.8281241412410021, -77.63948582712496],
        [0.8304970514043655, -77.63940926905973],
      ],
    },

    {
      id: 4,
      name: 'Zona 4',
      // Usa las coordenadas de la PRIMERA zona que ya pintaste (las mismas que usaste antes):
      points: [
        [0.8173657243236867, -77.6395589481912],
        [0.818932527111007, -77.64166316222108],
        [0.8215485932718115, -77.6433051371463],
        [0.822328238185683, -77.64593451392354],
        [0.8214862382281732, -77.64950699226378],
        [0.8255540279428233, -77.64871536610694],
        [0.8306308881817854, -77.64611831727608],
        [0.8329949425319059, -77.6456201161263],
        [0.8327088599318148, -77.64494577909416],
        [0.8304803340143382, -77.63944987377266],
      ],
    },

    {
      id: 5,
      name: 'Zona 5',
      // Usa las coordenadas de la PRIMERA zona que ya pintaste (las mismas que usaste antes):
      points: [
        [0.8352444200656898, -77.64526139179432],
        [0.8362049228276254, -77.65304348234294],
        [0.8349645577518261, -77.65680819040449],
        [0.8324635553223633, -77.6587768968543],
        [0.830749587456453, -77.66216911284509],
        [0.8286787968138775, -77.66835148259602],
        [0.8423986149413162, -77.6758382721842],
        [0.8364339931094966, -77.68124565457623],
        [0.828710018549452, -77.67802699138196],
        [0.8247131759653797, -77.67097219665385],
        [0.8204797460076884, -77.66077308698955],
        [0.8165351373975207, -77.66131929695528],
        [0.8144717649544896, -77.65961990565224],
        [0.8176274870180239, -77.65446117964682],
        [0.8237048668743436, -77.64899437963685],
        [0.8255050768557095, -77.64875742516764],
        [0.8307143416092495, -77.64625092902865],
        [0.8330092316441217, -77.64569121870731],
        [0.8332007688849811, -77.64579363559949],
      ],
    },
  ];

  ngAfterViewInit(): void {
    this.map = L.map(this.mapEl.nativeElement, {
      zoomControl: true,
      preferCanvas: true,
    }).setView(CENTER, ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    // 2) Pintar todas las zonas
    this.group.clearLayers();
    this.addSections(MapComponent.ZONES);
    this.group.addTo(this.map);

    // 3) Ajustar vista a TODO
    // if (this.group.getLayers().length) {
    //   this.map.fitBounds(this.group.getBounds().pad(0.15));
    // }

    // Evitar cortes en el card
    requestAnimationFrame(() => this.map.invalidateSize());
    this.ro = new ResizeObserver(() => this.map.invalidateSize());
    this.ro.observe(this.mapEl.nativeElement);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
    this.map?.remove();
  }

  // ---- Helpers ----
  private addSections(sections: Section[]) {
    const palette = [
      '#25a55f',
      '#1e88e5',
      '#8e24aa',
      '#fb8c00',
      '#43a047',
      '#d81b60',
    ];

    sections.forEach((s, i) => {
      if (!s.points?.length) return;
      const ring = this.cleanRing(s.points);
      if (this.uniquePointsCount(ring) < 3) {
        console.warn(`Zona ${s.id} ignorada: menos de 3 puntos únicos.`);
        return;
      }

      const stroke = '#1f2a1f';
      const fill = palette[i % palette.length];

      const poly = L.polygon(ring, {
        color: stroke,
        weight: 2,
        fillColor: fill,
        fillOpacity: 0.45,
      })
        .bindTooltip(`${s.name}`, { sticky: true })
        .on('mouseover', (e: any) => {
          const p = e.target as L.Path;
          p.setStyle({ weight: 3, fillOpacity: 0.6 });
          (p as any).bringToFront?.();
        })
        .on('mouseout', (e: any) => {
          const p = e.target as L.Path;
          p.setStyle({ weight: 2, fillOpacity: 0.45 });
        })
        .on('click', () => {
          // Emite el id y nombre de la zona
          this.zoneSelected.emit({ id: s.id, name: s.name });
          // Si prefieres recentrar o zoom por zona, hazlo aquí:
          // this.map.fitBounds(poly.getBounds().pad(0.18));
          // Luego, si quieres volver al centro fijo:
          // setTimeout(() => this.map.setView(CENTER, ZOOM), 600);
        });

      // (debug) vértices para cada zona (útil si se superponen)
      ring.forEach((pt) => {
        const marker = L.circleMarker(pt, {
          radius: 2.5,
          color: stroke,
          weight: 1,
          fillColor: fill,
          fillOpacity: 0.9,
        });
        this.group.addLayer(marker); // agrupa los marcadores en el featureGroup
      });

      this.group.addLayer(poly);
    });

  }

  /** Quita el último punto si repite el primero */
  private cleanRing(points: [number, number][]): [number, number][] {
    if (points.length < 2) return points;
    const a = points[0],
      b = points[points.length - 1];
    return a[0] === b[0] && a[1] === b[1] ? points.slice(0, -1) : points;
  }

  /** Cuenta puntos únicos (para evitar polígonos degenerados) */
  private uniquePointsCount(points: [number, number][]): number {
    const key = (p: [number, number]) =>
      `${p[0].toFixed(9)},${p[1].toFixed(9)}`;
    const set = new Set(points.map(key));
    return set.size;
  }
}
