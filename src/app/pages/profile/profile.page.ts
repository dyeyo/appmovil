import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonCard,
  IonButton,
} from '@ionic/angular/standalone';
import { ToolbarComponent } from 'src/app/shared/toolbar/toolbar.component';
import { LoaderComponent } from 'src/app/shared/loader/loader.component';
import { AuthSevice } from 'src/app/services/auth-sevice';
import { IonText } from '@ionic/angular/standalone';
import { SafeUrlPipe } from 'src/app/pipes/safe-url-pipe';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ToolbarComponent,
    LoaderComponent,
    IonAvatar,
    IonCard,
    IonText,
    SafeUrlPipe,
    IonButton,
  ],
})
export class ProfilePage implements OnInit {
  private authServices = inject(AuthSevice);
  private nav = inject(NavController);
  hasLoggin: boolean = false;
  miProfile: any = [];
  avatar: string = '';
  constructor() {}

  ngOnInit() {
    this.getMyInfo();
  }

  getMyInfo() {
    this.authServices.myProfile().subscribe({
      next: (res: any) => {
        if(res.length > 0) {
            this.hasLoggin = true
            this.miProfile = res[0];
            this.avatar = this.miProfile?.avatar.trim().split('=')[0];
        }else{
          this.nav.navigateRoot('/login');
          this.hasLoggin = false
        }
      }
    });
  }

  salir() {
    this.authServices.logout();
  }
}
