import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonContent,
  IonSearchbar,
  IonCardContent,
  IonCard,
  IonButton,
  IonImg,
  IonText,
  IonAvatar,
} from '@ionic/angular/standalone';
import { home, personCircle, personCircleOutline } from 'ionicons/icons';
import { IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { MapComponent } from 'src/app/components/map/map.component';
import { Router, RouterLink } from '@angular/router';
import { MorePostComponent } from 'src/app/components/more-post/more-post.component';
import { RecientEstatesService } from 'src/app/services/recient-estates-services';
import { RecientEstesComponent } from 'src/app/components/recient-estes/recient-estes.component';
import { AuthSevice } from 'src/app/services/auth-sevice';
import { IonicModule } from '@ionic/angular';
import { SafeUrlPipe } from 'src/app/pipes/safe-url-pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [RecientEstatesService],
})
export class HomePage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authServices = inject(AuthSevice);

  zones: any[] = [];
  picture: string = '';
  name: string = '';
  hasLoggin: boolean = false;
  token: any = '';
  filter: string = '';
  filterForm: FormGroup = new FormGroup({});
  recent$ = this.recentService.recent$;

  constructor(
    private recentService: RecientEstatesService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      home,
      personCircleOutline,
    });
    this.filterForm.reset();

    this.filterForm = this.fb.group({
      neighborhood: [null],
    });
  }

  async ngOnInit() {
    this.filter = '';
    this.filterForm.reset();
    this.token = await this.authServices.getToken();
  }

 
}
