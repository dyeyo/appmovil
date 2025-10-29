import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonTitle,
  IonHeader,
  IonContent,
  IonToolbar,
} from '@ionic/angular/standalone';
import { DetailComponent } from 'src/app/components/detail/detail.component';
import { EstatesService } from 'src/app/services/estates-service';
import { RecientEstatesService } from 'src/app/services/recient-estates-services';
import { ToolbarComponent } from 'src/app/shared/toolbar/toolbar.component';

type SectionLink = { id: string; label: string };
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [IonHeader, IonContent, DetailComponent, ToolbarComponent],
  providers: [EstatesService],
})
export class DetailsComponent implements AfterViewInit, OnInit {
  private services = inject(EstatesService);
  private servicesRecient = inject(RecientEstatesService);
  private route = inject(ActivatedRoute);

  @ViewChild(IonContent, { static: true }) content!: IonContent;
  @ViewChild('hdr', { read: ElementRef, static: true })
  hdr!: ElementRef<HTMLElement>;
  @ViewChild('nav', { read: ElementRef, static: true })
  nav!: ElementRef<HTMLElement>;

  sections = [
    { id: 'overview', label: 'Inicio' },
    { id: 'features', label: 'Características' },
    { id: 'map', label: 'Ubicación' },
    { id: 'agent', label: 'Anunciante' },
    { id: 'more', label: 'Más' },
  ];

  activeId = this.sections[0].id;
  showNav = false;
  loading = false;
  private headerH = 56; // se recalcula con el header real
  private navH = 44;
  private anchors: Record<string, number> = {};
  private orderedIds: string[] = [];
  private sentinelTop = 0;

  estateId!: number;
  detail: any = {};

  async ngAfterViewInit() {
    // 1) medir header real y pegar barra justo debajo
    this.headerH = this.hdr.nativeElement.offsetHeight || this.headerH;
    this.nav.nativeElement.style.top = `${this.headerH}px`;

    // 2) calcular anclas dentro del scroller
    const scroller = await this.content.getScrollElement();
    this.computeAnchors(scroller);
    this.sentinelTop = this.anchors['overview'] ?? 0;

    // 3) actualizar en reflow/resize
    setTimeout(() => {
      this.computeAnchors(scroller);
      this.sentinelTop = this.anchors['overview'] ?? 0;
    }, 300);
    new ResizeObserver(() => {
      this.headerH = this.hdr.nativeElement.offsetHeight || this.headerH;
      this.nav.nativeElement.style.top = `${this.headerH}px`;
      this.computeAnchors(scroller);
      this.sentinelTop = this.anchors['overview'] ?? 0;
    }).observe(scroller);
  }

  ngOnInit(): void {
    this.estateId = +this.route.snapshot.paramMap.get('id')!;
    this.getDeatilId(this.estateId);
  }

  onScroll(ev: CustomEvent) {
    const y = (ev.detail as any).scrollTop ?? 0;

    // aparece al pasar overview, se oculta al tope
    this.showNav = y >= Math.max(0, this.sentinelTop - this.headerH - 1);

    // scrollspy (compensa header + barra si visible)
    const topOffset = this.headerH + (this.showNav ? this.navH : 0);
    let current = this.orderedIds[0];
    for (const id of this.orderedIds) {
      if ((this.anchors[id] ?? 0) - topOffset <= y) current = id;
      else break;
    }
    this.activeId = current;
  }

  async scrollTo(id: string) {
    const scroller = await this.content.getScrollElement();
    // fuerza mostrar la barra para tener un offset estable
    this.showNav = true;
    await new Promise((r) => requestAnimationFrame(() => r(null))); // espera a que se aplique .show

    const el =
      scroller.querySelector<HTMLElement>('#' + id) ||
      document.getElementById(id);
    if (!el) return;

    const headerH = this.hdr.nativeElement.offsetHeight || 56;
    const navH = this.nav.nativeElement.offsetHeight || 44;

    // posición absoluta del target dentro del scroller
    const sRect = scroller.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const targetY = r.top - sRect.top + scroller.scrollTop - (headerH + navH);

    await this.content.scrollToPoint(0, Math.max(0, Math.floor(targetY)), 400);
  }

  private computeAnchors(scroller: HTMLElement) {
    // opcional (para scrollspy); si alguna falta no pasa nada en scrollTo
    const sRect = scroller.getBoundingClientRect();
    this.anchors = {};
    for (const s of this.sections) {
      const el = scroller.querySelector<HTMLElement>('#' + s.id);
      if (el) {
        const r = el.getBoundingClientRect();
        this.anchors[s.id] = r.top - sRect.top + scroller.scrollTop;
      }
    }
    this.orderedIds = Object.entries(this.anchors)
      .sort((a, b) => a[1] - b[1])
      .map(([id]) => id);
  }

  getDeatilId(estateId: number) {
    this.loading = true;
    this.services.getDetail(estateId).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.detail = res ?? [];
        this.servicesRecient.addViewed(this.detail);
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
}
