// service-management.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ServiceTypeService } from '../../../core/services/service-type.service';
import { ServiceType } from '../../../core/models';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-service-management',
  imports:[ReactiveFormsModule,ButtonModule,CommonModule,ToastModule],
  providers:[MessageService],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Gestion des Services</h1>

      <!-- Formulaire de création/édition -->
      <form
        [formGroup]="serviceForm"
        (ngSubmit)="sauvegarderService()"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div class="grid grid-cols-2 gap-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Nom du Service
            </label>
            <input
              formControlName="name"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              type="text"
              placeholder="Nom du service"
            >
          </div>


          <div class="mb-4 col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              formControlName="description"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-24"
              placeholder="Description détaillée du service"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Prix
            </label>
            <input
              formControlName="baseCost"
              type="number"
              step="1000"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Prix du service"
            >
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Durée Estimée (minutes)
            </label>
            <input
              formControlName="defaultDuration"
              type="number"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Durée estimée"
            >
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            [disabled]="!serviceForm.valid"
          >
            {{ serviceEnEdition ? 'Mettre à jour' : 'Ajouter Service' }}
          </button>
          <button
            type="button"
            *ngIf="serviceEnEdition"
            (click)="annulerEdition()"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Annuler
          </button>
        </div>
      </form>

      <!-- Tableau des services -->
      <div class="bg-white shadow-md rounded">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-200">
              <th class="py-3 px-4 text-left">Nom</th>
\              <th class="py-3 px-4 text-right">Prix</th>
              <th class="py-3 px-4 text-center">Durée</th>
              <th class="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let service of services"
              class="border-b hover:bg-gray-100"
            >
              <td class="py-3 px-4">{{ service.name }}</td>
              <td class="py-3 px-4 text-right">{{ service.baseCost.toLocaleString() }} </td>
              <td class="py-3 px-4 text-center">{{ service.defaultDuration }} min</td>
              <td class="py-3 px-4 text-center">
                <button
                  (click)="modifierService(service)"
                  class="text-blue-500 hover:text-blue-700 mr-3"
                >
                  <i class="pi pi-pencil"></i>
                </button>
                <button
                  (click)="supprimerService(service)"
                  class="text-red-500 hover:text-red-700"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <p-toast></p-toast>
  `
})
export class ServiceManagementComponent implements OnInit {
  services: ServiceType[] = [];
  serviceForm: FormGroup;
  serviceEnEdition: ServiceType | null = null;

  constructor(private fb: FormBuilder, private serviceTypeService: ServiceTypeService,private messageService : MessageService) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      baseCost: [null, [Validators.required, Validators.min(0)]],
      defaultDuration: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    // Charger les services existants
    this.chargerServices();
  }

  chargerServices() {
    // Simulation de données - à remplacer par un appel de service
    this.services = [
      {
        _id: '1',
        name: 'Vidange',
        description: 'Vidange complète avec remplacement du filtre',
        baseCost: 80,
        defaultDuration: 45,
      },
      {
        _id: '2',
        name: 'Changement des plaquettes',
        description: 'Remplacement des plaquettes de frein',
        baseCost: 150,
        defaultDuration: 90,
      }
    ];
    this.serviceTypeService.getAllServiceTypes().subscribe({
        next: (services) => {
            this.services = services;
        },
        error: (err) => console.error('Error loading services:', err)
    });


  }

  sauvegarderService() {
    if (this.serviceForm.valid) {
      const serviceData: ServiceType = this.serviceForm.value;

      if (this.serviceEnEdition) {
        const servicesId = this.serviceEnEdition._id;
        // Mise à jour
        this.serviceTypeService.updateServiceType(this.serviceEnEdition._id!,serviceData).subscribe({
            next: (service) =>{
                const index = this.services.findIndex(s => s._id === servicesId);
                if (index !== -1) {
                    this.services = [
                        ...this.services.slice(0, index),
                        service,
                        ...this.services.slice(index + 1)
                    ];
                }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Servicess mis à jour'
                });
            },
        });
      } else {
        // Ajout
        this.serviceTypeService.createServiceType(serviceData).subscribe({
            next:(newService) =>{
                this.services.push(newService);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Services créé'
                });
            },
            error: (err) => {
                console.error('Error creating serviceType:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de créer le services'
                });
            }
        })
      }

      // Réinitialiser le formulaire
      this.serviceForm.reset();
      this.serviceEnEdition = null;
    }
  }

  modifierService(service: ServiceType) {
    this.serviceEnEdition = service;
    this.serviceForm.patchValue(service);
  }

  supprimerService(service: ServiceType) {
    // Confirmation avant suppression
    if (confirm(`Voulez-vous vraiment supprimer le service "${service.name}" ?`)) {
      this.services = this.services.filter(s => s._id !== service._id);
      this.serviceTypeService.deleteServiceType(service._id!).subscribe({

      });
    }
  }

  annulerEdition() {
    this.serviceForm.reset();
    this.serviceEnEdition = null;
  }
}
