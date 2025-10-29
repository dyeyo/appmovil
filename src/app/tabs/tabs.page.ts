import { Component, EnvironmentInjector, inject } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  logoIonic,
  personOutline,
  homeOutline,
  heartCircleOutline,
  addCircleOutline,
} from 'ionicons/icons';
import { AddComponent } from '../pages/add/add.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, AddComponent],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  public modalCtrl = inject(ModalController);

  constructor() {
    addIcons({
      homeOutline,
      heartCircleOutline,
      addCircleOutline,
      personOutline,
      logoIonic,
    });
  }

}
