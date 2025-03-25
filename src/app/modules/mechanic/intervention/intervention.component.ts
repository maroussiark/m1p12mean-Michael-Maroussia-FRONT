import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { EditorModule } from 'primeng/editor';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// Import des nouveaux modèles
import { Appointment, AppointmentStatus, AppointmentService, PartUsage } from '../../../core/models';
import { Part } from '../../../core/models/part.model';
import { SelectModule } from 'primeng/select';

interface Difficulte {
  nom: string;
  description: string;
}

// Interface pour l'affichage des rendez-vous (fictifs)
interface DisplayAppointment {
  id: number;
  clientName: string;
  clientPhone: string;
  vehicleModel: string;
  vehiclePlate: string;
  serviceTypes: string[];
  appointmentDate: Date;
  duration: number;
  status: string;
  notes: string;
  mechanicIds: number[];
}

@Component({
  selector: 'app-intervention',
  templateUrl: './intervention.component.html',
  styleUrls: ['./intervention.component.scss'],
  providers: [MessageService, ConfirmationService],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    MultiSelectModule,
    ToastModule,
    CommonModule,
    InputNumberModule,
    FormsModule,
    EditorModule,
    TableModule,
    CalendarModule,
    ConfirmDialogModule,
    SelectModule
  ]
})
export class InterventionComponent implements OnInit {
  travauxForm!: FormGroup;
  rendezVousSelectionne: DisplayAppointment | null = null;
  rechercheTexte: string = '';
  dateFiltre: Date | null = null;

  difficulties: Difficulte[] = [
    { nom: 'Accès difficile', description: "Pièces difficiles d'accès" },
    { nom: 'Pièces rouillées', description: 'Éléments fortement corrodés' },
    { nom: 'Pièces non standard', description: 'Pièces spécifiques requises' },
    { nom: 'Défauts multiples', description: 'Plusieurs problèmes identifiés' }
  ];

  parts: Part[] = [
    { _id: 'part1', name: 'Filtre à air', description: 'Filtre à air', price: 30 },
    { _id: 'part2', name: 'Plaquettes de frein', description: 'Plaquettes de frein avant', price: 100 },
    { _id: 'part3', name: 'Batterie', description: 'Batterie auto', price: 150 }
  ];

  // Rendez-vous fictifs
  rendezVous: DisplayAppointment[] = [
    {
      id: 1001,
      clientName: 'Jean Dupont',
      clientPhone: '06 12 34 56 78',
      vehicleModel: 'Renault Clio',
      vehiclePlate: 'AB-123-CD',
      serviceTypes: ['Révision périodique', 'Changement filtres'],
      appointmentDate: new Date(2025, 2, 20),
      duration: 60,
      status: 'planifié',
      notes: 'Client habituel',
      mechanicIds: [1, 3]
    },
    {
      id: 1002,
      clientName: 'Marie Martin',
      clientPhone: '06 98 76 54 32',
      vehicleModel: 'Peugeot 308',
      vehiclePlate: 'EF-456-GH',
      serviceTypes: ['Changement plaquettes de frein'],
      appointmentDate: new Date(2025, 2, 20),
      duration: 45,
      status: 'planifié',
      notes: 'Véhicule sous garantie',
      mechanicIds: [2]
    },
    {
      id: 1003,
      clientName: 'Sophie Bernard',
      clientPhone: '07 11 22 33 44',
      vehicleModel: 'Citroën C3',
      vehiclePlate: 'IJ-789-KL',
      serviceTypes: ['Diagnostic panne électrique', 'Contrôle batterie'],
      appointmentDate: new Date(2025, 2, 21),
      duration: 90,
      status: 'planifié',
      notes: 'Problème de démarrage intermittent',
      mechanicIds: [1]
    }
  ];

  rendezVousFiltres: DisplayAppointment[] = [...this.rendezVous];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.travauxForm = this.fb.group({
      pieces: this.fb.array([this.createPieceFormGroup()]),
      tempsPasse: ['', [Validators.required, Validators.min(0.1)]],
      difficultes: [[]],
      difficulteAutre: [''],
      recommandations: [''] // non obligatoire
    });
  }

  createPieceFormGroup(): FormGroup {
    return this.fb.group({
      part: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ajouterPiece(): void {
    const piecesArray = this.travauxForm.get('pieces') as FormArray;
    piecesArray.push(this.createPieceFormGroup());
  }

  supprimerPiece(index: number): void {
    const piecesArray = this.travauxForm.get('pieces') as FormArray;
    if (piecesArray.length > 1) {
      piecesArray.removeAt(index);
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Au moins une pièce est requise' });
    }
  }

  filtrerRendezVous(): void {
    this.rendezVousFiltres = this.rendezVous.filter(rdv => {
      let matchDate = true;
      let matchText = true;

      if (this.dateFiltre) {
        matchDate = rdv.appointmentDate.toDateString() === this.dateFiltre.toDateString();
      }

      if (this.rechercheTexte.trim()) {
        const searchLower = this.rechercheTexte.toLowerCase();
        matchText = rdv.clientName.toLowerCase().includes(searchLower) ||
                    rdv.vehiclePlate.toLowerCase().includes(searchLower) ||
                    rdv.serviceTypes.some(service => service.toLowerCase().includes(searchLower));
      }

      return matchDate && matchText;
    });
  }

  selectionnerRendezVous(rdv: DisplayAppointment): void {
    this.rendezVousSelectionne = rdv;
    this.travauxForm.patchValue({ appointmentId: rdv.id });
  }

  annulerSelection(): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir changer de rendez-vous ? Les données saisies seront perdues.',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.rendezVousSelectionne = null;
        this.initForm();
      }
    });
  }

  getFormattedTime(date: Date): string {
    return date.getHours().toString().padStart(2, '0') + ':' +
           date.getMinutes().toString().padStart(2, '0');
  }

  validerIntervention(): void {
    if (this.travauxForm.valid) {
      const donneesTravaux = {
        ...this.travauxForm.value,
        clientName: this.rendezVousSelectionne?.clientName,
        vehiclePlate: this.rendezVousSelectionne?.vehiclePlate,
        dateIntervention: new Date(),
        mechanicIds: this.rendezVousSelectionne?.mechanicIds
      };

      console.log('Données à enregistrer:', donneesTravaux);
      this.messageService.add({
        severity: 'success',
        summary: 'Intervention validée',
        detail: `Travaux enregistrés pour le véhicule ${this.rendezVousSelectionne?.vehicleModel} (${this.rendezVousSelectionne?.vehiclePlate})`
      });

      this.rendezVousSelectionne = null;
      this.initForm();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez compléter tous les champs obligatoires' });
      this.validateAllFormFields(this.travauxForm);
    }
  }

  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  get pieces(): FormArray {
    return this.travauxForm.get('pieces') as FormArray;
  }
}
