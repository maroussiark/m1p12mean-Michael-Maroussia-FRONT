import { CommonModule } from '@angular/common';
// invoice-history.component.ts
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

interface Operation {
  description: string;
  prix: number;
}

interface Invoice {
  id: number;
  date: Date;
  operations: Operation[];
  totalHT: number;
  totalTTC: number;
  tvaRate: number;
}

@Component({
  selector: 'app-invoice-history',
  imports:[TableModule,CommonModule,DialogModule,ButtonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Historique des Factures</h1>

      <p-table
        [value]="invoices"
        [paginator]="true"
        [rows]="10"
        [responsive]="true"
        class="shadow-md rounded-lg"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>Date</th>
            <th>Nombre d'opérations</th>
            <th>Total HT</th>
            <th>Total TTC</th>
            <th>Actions</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-invoice>
          <tr>
            <td>{{ invoice.date | date:'dd/MM/yyyy' }}</td>
            <td>{{ invoice.operations.length }}</td>
            <td>{{ invoice.totalHT | currency:'EUR':'symbol':'1.2-2' }}</td>
            <td>{{ invoice.totalTTC | currency:'EUR':'symbol':'1.2-2' }}</td>
            <td>
              <p-button
                icon="pi pi-file-pdf"
                (click)="voirFacture(invoice)"
                styleClass="p-button-info p-button-text"
              ></p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <p-dialog
        [(visible)]="afficherFacture"
        [modal]="true"
        [header]="'Détails de la Facture'"
        [style]="{width: '600px'}"
      >
        <ng-container *ngIf="factureSelectionnee">
          <div class="p-4">
            <div class="text-center mb-4">
              <h2 class="text-xl font-bold">Facture du {{ factureSelectionnee.date | date:'dd/MM/yyyy' }}</h2>
            </div>

            <table class="w-full mb-4">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2">Opération</th>
                  <th class="text-right py-2">Prix</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let operation of factureSelectionnee.operations" class="border-b">
                  <td class="py-2">{{ operation.description }}</td>
                  <td class="text-right py-2">{{ operation.prix | currency:'EUR':'symbol':'1.2-2' }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td class="py-2 font-bold">Total HT</td>
                  <td class="text-right py-2">{{ factureSelectionnee.totalHT | currency:'EUR':'symbol':'1.2-2' }}</td>
                </tr>
                <tr>
                  <td class="py-2 font-bold">TVA ({{ factureSelectionnee.tvaRate }}%)</td>
                  <td class="text-right py-2">
                    {{ (factureSelectionnee.totalTTC - factureSelectionnee.totalHT) | currency:'EUR':'symbol':'1.2-2' }}
                  </td>
                </tr>
                <tr>
                  <td class="py-2 font-bold text-lg">Total TTC</td>
                  <td class="text-right py-2 font-bold text-lg">
                    {{ factureSelectionnee.totalTTC | currency:'EUR':'symbol':'1.2-2' }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </ng-container>
      </p-dialog>
    </div>
  `
})
export class InvoiceHistoryComponent implements OnInit {
  invoices: Invoice[] = [];
  afficherFacture = false;
  factureSelectionnee: Invoice | null = null;

  constructor() {}

  ngOnInit() {
    this.chargerFactures();
  }

  chargerFactures() {
    // Remplacer par l'appel de service réel
    this.invoices = [
      {
        id: 1,
        date: new Date(),
        operations: [
          { description: 'Vidange', prix: 80 },
          { description: 'Changement filtre à huile', prix: 30 },
          { description: 'Vérification freins', prix: 50 }
        ],
        totalHT: 160,
        totalTTC: 192,
        tvaRate: 20
      },
      // Ajouter plus de factures de test
    ];
  }

  voirFacture(invoice: Invoice) {
    this.factureSelectionnee = invoice;
    this.afficherFacture = true;
  }
}
