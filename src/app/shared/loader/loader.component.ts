import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonText,
  IonSkeletonText,
  IonLabel,
  IonList,
  IonItem,
  IonListHeader,
  IonCard,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonCardContent,
  IonRow,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  imports: [
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCard,
    IonSkeletonText,
  ],
})
export class LoaderComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
