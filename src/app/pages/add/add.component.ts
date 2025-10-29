import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: [
    `
      /* Banner */
      .hero {
        background: #1e3a8a;
        color: #fff;
        min-height: 42vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0 20px;
        h1 {
          margin-top: -3em;
        }
        .login {
          // position: absolute;
          // z-index: 2;
          // right: 1em;
          // padding: 5px;
          // align-items: center;
          margin-top: -7em;
        }
      }

      /* Card “flotando” pero en flujo */
      .search-card {
        width: min(92%, 880px);
        margin: -112px auto 0; /* sube la card sobre el banner */
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
        border-radius: 16px;
        text-align: center;
      }
      .bodyCard {
        align-items: center;
        text-align: center;
        margin-top: 2em;
      }
      .icono {
        font-size: 23px;
        padding-right: 5px;
      }
      .twoLine {
        display: flex;
        flex-direction: column;
      }
      @media (max-width: 600px) {
        .search-card {
          margin: -140px auto 0;
        }
      }

      // -->
      .results2 {
        padding: 12px 16px; /* top extra para dejar espacio al card */
      }
      .text-center {
        text-align: center;
      }
      .custom-card {
        position: relative;
        overflow: hidden;
        border-radius: 12px;

        .card-image {
          position: relative;

          img {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 12px;
          }

          .overlay {
            position: absolute;
            inset: 0;
            background: rgb(0 0 0 / 29%); // oscuridad encima de la imagen
            border-radius: 12px;
          }

          .overlay-text {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            color: #fff;
            font-size: 1.1rem;
            font-weight: 600;
            line-height: 1.4;
            z-index: 2; // asegurar que quede encima del overlay
          }
        }
      }
      .overlay {
        position: absolute;
        inset: 0;
        background: rgb(0 0 0 / 29%); // oscuridad encima de la imagen
        border-radius: 12px;
      }
    `,
  ],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  constructor(private modalCtrl: ModalController) {
    addIcons({
      closeOutline,
      checkmarkOutline,
    });
  }

  ngOnInit() {}

  onWillDismiss(event: any) {}

  onExactChange(v: boolean) {}

  cancel() {
    this.modalCtrl.dismiss();
  }
}
