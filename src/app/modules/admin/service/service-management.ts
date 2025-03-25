// service-management.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

interface Service {
  id?: number;
  nom: string;
  description: string;
  prix: number;
  dureeEstimee: number; // en minutes
  categorie: string;
}

@Component({
  selector: 'app-service-management',
  imports:[ReactiveFormsModule,ButtonModule,CommonModule],
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
              formControlName="nom"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              type="text"
              placeholder="Nom du service"
            >
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Catégorie
            </label>
            <select
              formControlName="categorie"
              class="shadow border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="Entretien">Entretien</option>
              <option value="Réparation">Réparation</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Pneumatique">Pneumatique</option>
              <option value="Carrosserie">Carrosserie</option>
            </select>
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
              Prix (€)
            </label>
            <input
              formControlName="prix"
              type="number"
              step="0.01"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Prix du service"
            >
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Durée Estimée (minutes)
            </label>
            <input
              formControlName="dureeEstimee"
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
              <th class="py-3 px-4 text-left">Catégorie</th>
              <th class="py-3 px-4 text-right">Prix</th>
              <th class="py-3 px-4 text-center">Durée</th>
              <th class="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let service of services"
              class="border-b hover:bg-gray-100"
            >
              <td class="py-3 px-4">{{ service.nom }}</td>
              <td class="py-3 px-4">{{ service.categorie }}</td>
              <td class="py-3 px-4 text-right">{{ service.prix }} €</td>
              <td class="py-3 px-4 text-center">{{ service.dureeEstimee }} min</td>
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
  `
})
export class ServiceManagementComponent implements OnInit {
  services: Service[] = [];
  serviceForm: FormGroup;
  serviceEnEdition: Service | null = null;

  constructor(private fb: FormBuilder) {
    this.serviceForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      prix: [null, [Validators.required, Validators.min(0)]],
      dureeEstimee: [null, [Validators.required, Validators.min(0)]],
      categorie: ['', Validators.required]
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
        id: 1,
        nom: 'Vidange',
        description: 'Vidange complète avec remplacement du filtre',
        prix: 80,
        dureeEstimee: 45,
        categorie: 'Entretien'
      },
      {
        id: 2,
        nom: 'Changement des plaquettes',
        description: 'Remplacement des plaquettes de frein',
        prix: 150,
        dureeEstimee: 90,
        categorie: 'Réparation'
      }
    ];
  }

  sauvegarderService() {
    if (this.serviceForm.valid) {
      const serviceData: Service = this.serviceForm.value;

      if (this.serviceEnEdition) {
        // Mise à jour
        const index = this.services.findIndex(s => s.id === this.serviceEnEdition?.id);
        if (index !== -1) {
          this.services[index] = { ...this.serviceEnEdition, ...serviceData };
        }
      } else {
        // Ajout
        serviceData.id = this.services.length + 1;
        this.services.push(serviceData);
      }

      // Réinitialiser le formulaire
      this.serviceForm.reset();
      this.serviceEnEdition = null;
    }
  }

  modifierService(service: Service) {
    this.serviceEnEdition = service;
    this.serviceForm.patchValue(service);
  }

  supprimerService(service: Service) {
    // Confirmation avant suppression
    if (confirm(`Voulez-vous vraiment supprimer le service "${service.nom}" ?`)) {
      this.services = this.services.filter(s => s.id !== service.id);
    }
  }

  annulerEdition() {
    this.serviceForm.reset();
    this.serviceEnEdition = null;
  }
}
