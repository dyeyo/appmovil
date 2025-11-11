import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonCard,
  IonText,
} from '@ionic/angular/standalone';
import { AuthSevice } from 'src/app/services/auth-sevice';
import { NavController } from '@ionic/angular';
import { ToolbarComponent } from 'src/app/shared/toolbar/toolbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonCard,
    CommonModule,
    FormsModule,
    ToolbarComponent,
    IonText,
  ],
})
export class LoginPage implements OnInit {
  constructor(private auth: AuthSevice, private nav: NavController) {}
  
  ngOnInit() {}

  async onGoogle() {
    try {
      const token = await this.auth.loginWithGoogle();
      this.nav.navigateRoot('/home');
    } catch (e) {
      console.error('Login fallido', e);
    }
  }
}
