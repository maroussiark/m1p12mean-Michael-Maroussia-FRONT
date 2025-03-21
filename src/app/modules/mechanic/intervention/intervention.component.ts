// travaux-realises.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { FormArray } from '@angular/forms';
import { Editor } from 'primeng/editor';
import { TableModule } from 'primeng/table';
import { Calendar } from '@fullcalendar/core/index.js';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface Difficulte {
    nom: string;
    description: string;
}

interface Appointment {
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
    providers: [MessageService,ConfirmationService],
    imports: [ReactiveFormsModule, ButtonModule, MultiSelectModule, ToastModule, CommonModule, InputNumberModule, FormsModule, Editor,TableModule,CalendarModule,ConfirmDialogModule]
})
export class InterventionComponent implements OnInit {
    travauxForm!: FormGroup;
    rendezVousSelectionne: Appointment | null = null;
    rechercheTexte: string = '';
    dateFiltre: Date | null = null;


    difficulties: Difficulte[] = [
        { nom: 'Accès difficile', description: "Pièces difficiles d'accès" },
        { nom: 'Pièces rouillées', description: 'Éléments fortement corrodés' },
        { nom: 'Pièces non standard', description: 'Pièces spécifiques requises' },
        { nom: 'Défauts multiples', description: 'Plusieurs problèmes identifiés' }
    ];

    rendezVous: Appointment[] = [
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

      rendezVousFiltres: Appointment[] = [...this.rendezVous];

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
            operations: this.fb.array([this.createOperationFormGroup()]),
            tempsPasse: ['', [Validators.required, Validators.min(0.1)]],
            difficultes: [[]],
            difficulteAutre: [''],
            recommandations: ['', Validators.required],
            observations: ['']
        });
    }

    createOperationFormGroup(): FormGroup {
        return this.fb.group({
            description: ['', Validators.required],
            pieces: [''],
            duree: [0, Validators.min(0)]
        });
    }

    ajouterOperation(): void {
        const operations = this.travauxForm.get('operations') as any;
        operations.push(this.createOperationFormGroup());
    }

    supprimerOperation(index: number): void {
        const operations = this.travauxForm.get('operations') as any;
        if (operations.length > 1) {
            operations.removeAt(index);
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Au moins une opération est requise' });
        }
    }

      // Méthodes de gestion des rendez-vous
  filtrerRendezVous(): void {
    this.rendezVousFiltres = this.rendezVous.filter(rdv => {
      let matchDate = true;
      let matchText = true;

      // Filtre par date
      if (this.dateFiltre) {
        matchDate = rdv.appointmentDate.toDateString() === this.dateFiltre.toDateString();
      }

      // Filtre par texte (recherche dans le nom du client, plaque d'immat ou type de service)
      if (this.rechercheTexte.trim()) {
        const searchLower = this.rechercheTexte.toLowerCase();
        matchText = rdv.clientName.toLowerCase().includes(searchLower) ||
                   rdv.vehiclePlate.toLowerCase().includes(searchLower) ||
                   rdv.serviceTypes.some(service => service.toLowerCase().includes(searchLower));
      }

      return matchDate && matchText;
    });
  }

  selectionnerRendezVous(rdv: Appointment): void {
    this.rendezVousSelectionne = rdv;
    // Mettre à jour l'ID du rendez-vous dans le formulaire
    this.travauxForm.patchValue({
      appointmentId: rdv.id
    });
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
      // Préparer les données pour l'enregistrement
      const donneesTravaux = {
        ...this.travauxForm.value,
        clientName: this.rendezVousSelectionne?.clientName,
        vehiclePlate: this.rendezVousSelectionne?.vehiclePlate,
        dateIntervention: new Date(),
        mechanicIds: this.rendezVousSelectionne?.mechanicIds
      };

      // Enregistrement des données
      console.log('Données à enregistrer:', donneesTravaux);
      this.messageService.add({
        severity: 'success',
        summary: 'Intervention validée',
        detail: `Travaux enregistrés pour le véhicule ${this.rendezVousSelectionne?.vehicleModel} (${this.rendezVousSelectionne?.vehiclePlate})`
      });

      // Réinitialisation
      this.rendezVousSelectionne = null;
      this.initForm();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez compléter tous les champs obligatoires' });
      this.validateAllFormFields(this.travauxForm);
    }
  }

    private validateAllFormFields(formGroup: FormGroup = this.travauxForm): void {
        Object.keys(formGroup.controls).forEach((field) => {
            const control = formGroup.get(field);
            if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            } else {
                if (control) {
                    control.markAsTouched({ onlySelf: true });
                }
            }
        });
    }

    get operations(): FormArray {
        return this.travauxForm.get('operations') as FormArray;
    }


}
