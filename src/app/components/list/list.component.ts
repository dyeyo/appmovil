import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import { SliderComponent } from '../slider/slider.component';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { FavoritosServices } from 'src/app/services/favoritos-services';
import { AuthSevice } from 'src/app/services/auth-sevice';
import { NavController } from '@ionic/angular';
import { Toast } from '@capacitor/toast';

export type CardItem = {
  title: string;
  subtitle?: string;
  badge?: string;
  img?: string;
};

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CommonModule,
    SliderComponent,
    RouterLink,
  ],
  providers: [FavoritosServices],
})
export class ListComponent implements OnInit {
  @Input() items: any = [];

  constructor() {
    addIcons({
      heartOutline,
      heart,
    });
  }

  private route = inject(ActivatedRoute);
  private service = inject(FavoritosServices);
  private authService = inject(AuthSevice);
  private nav = inject(NavController);

  zoneId!: string;

  ngOnInit() {
    this.zoneId = this.route.snapshot.paramMap.get('id')!;
  }

  handlerFavs(estateId: number, action: number) {
    if (action === 1) {
      this.service.handlerFavs(estateId).subscribe({
        next: (res: any) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.service.deleteFav(estateId).subscribe({
        next: (res: any) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  async toggleFav(item: any, ev?: Event) {
    const token = await this.authService.getToken();
    if (!token) {
      await Toast.show({
        text: 'Debe inicar sesión para agregar o ver favoritos',
      });
      this.nav.navigateRoot('/login', { animated: true });
    }
    console.log(token);
    ev?.stopPropagation();
    ev?.preventDefault();

    const prev = !!item.favorites; 
    const next = !prev; 

    // Optimista: cambia ya
    item.favorites = next;

    // Notifica a toda la app (pág. Favoritos, listados, etc.)
    this.service.broadcastChange(item.id, next);

    // Llama API según el estado deseado
    const req$ = next
      ? this.service.handlerFavs(item.id)
      : this.service.deleteFav(item.id);

    req$.subscribe({
      next: () => {},
      error: (err) => {
        console.error(err);
        // Revertir todo si falla
        item.favorites = prev;
        this.service.broadcastChange(item.id, prev);
      },
    });
  }
}
