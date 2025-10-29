import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { RouterOutlet } from '@angular/router';
import { TabsPage } from 'src/app/tabs/tabs.page';

@Component({
  selector: 'app-shell-layout-component',
  templateUrl: './shell-layout-component.component.html',
  styleUrls: ['./shell-layout-component.component.scss'],
  standalone: true,
  imports: [ IonContent, RouterOutlet, TabsPage],
})
export class ShellLayoutComponentComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
