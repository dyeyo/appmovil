import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonTitle,
  IonHeader,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, searchOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonIcon,
    FormsModule,
    CommonModule,
  ],
})
export class ToolbarComponent implements OnInit {
  @Input('title') title: string = 'Inmobilapp';
  @Input('tieneBuscar') tieneBuscar: boolean = true;

  constructor(private navCtrl: NavController) {
    addIcons({
      searchOutline,
      arrowBackOutline,
    });
  }

  ngOnInit() {}

  goBack() {
    this.navCtrl.back();
  }
}
