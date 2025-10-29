import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControlDirective,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonTitle,
  IonHeader,
  IonToolbar,
  IonButton,
  IonButtons,
  IonModal,
  IonContent,
  IonInput,
  IonItem,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonChip,
  IonSelect,
  IonSelectOption,
  IonFooter,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { EstatesService } from 'src/app/services/estates-service';

@Component({
  selector: 'app-modal-filter',
  templateUrl: './modal-filter.component.html',
  styleUrls: ['./modal-filter.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonModal,
    FormsModule,
    IonContent,
    IonInput,
    IonItem,
    CommonModule,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonChip,
    IonSelect,
    IonSelectOption,
    IonFooter,
    IonRow,
    IonCol,
    ReactiveFormsModule,
  ],
})
export class ModalFilterComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  @Output() dataFilter = new EventEmitter<[]>();
  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;
  features = [
    { id: 'conjunto_privado', name: 'Seguridad' },
    { id: 'entrada_independiente', name: 'Entrada independiente' },
    { id: 'garaje', name: 'Garaje' },
    { id: 'sala', name: 'Sala' },
  ];
  filterForm: FormGroup = new FormGroup({});
  estatesFilter: [] = [];
  private services = inject(EstatesService);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.filterForm = this.fb.group(
      {
        min_price: [null, [Validators.min(100000)]],
        max_price: [null],
        n_habitaciones: [''],
        n_banos: [''],
        estrato: [''],
        type_id: [''],
        contrato: [null],
        extras: this.fb.control<string[]>([]),
      },
      { validators: this.minMenorQueMax('min_price', 'max_price') }
    );
  }

  confirm() {
    const extrasObj = this.filterForm.value.extras.reduce(
      (acc: any, key: any) => {
        acc[key] = 1;
        return acc;
      },
      {} as Record<string, boolean>
    );

    const payload = {
      min_price: this.filterForm.value.min_price,
      max_price: this.filterForm.value.max_price,
      n_habitaciones: this.filterForm.value.n_habitaciones,
      n_banos: this.filterForm.value.n_banos,
      estrato: this.filterForm.value.estrato,
      type_id: this.filterForm.value.type_id,
      contrato: this.filterForm.value.contrato,
      ...extrasObj,
    };

    this.services.searchEstatesByFilters(payload).subscribe({
      next: (res: any) => {
        // 🚀 Emito un objeto con data + filtros
        this.dataFilter.emit({ ...res, filters: payload });
        this.modal?.dismiss();
      },
      error: (err: any) => console.log(err),
      complete: () => this.clear(),
    });
  }

  get selected(): string[] {
    return this.filterForm.get('extras')!.value ?? [];
  }

  toggle(item: string) {
    const current = this.selected;
    const next = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    this.filterForm.get('extras')!.setValue(next);
  }

  clear() {
    this.filterForm.reset({
      min_price: null,
      max_price: null,
      n_habitaciones: '',
      n_banos: '',
      estrato: '',
      type_id: '',
      contrato: null,
      extras: [],
    });
  }

  onWillDismiss(event: any) {
    this.message = `Hello,!`;
  }

  onExactChange(v: boolean) {}

  cancel() {
    this.modal.dismiss('', 'cancel');
    this.clear();
  }

  // validador cruzado opcional
  private minMenorQueMax(minKey: string, maxKey: string) {
    return (fg: FormGroup) => {
      const min = fg.get(minKey)?.value ?? 0;
      const max = fg.get(maxKey)?.value ?? 0;
      return max > 0 && min > 0 && min > max ? { rangoInvalido: true } : null;
    };
  }
}
