import { PartService } from './../../../core/services/part.service';
import { Part } from './../../../core/models/part.model';
// part-list.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-part-list',
  templateUrl: './part-list.component.html',
  providers: [MessageService],
  imports:[
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    ToastModule
  ]
})
export class PartListComponent implements OnInit {
  parts: Part[] = [];
  selectedPart: Part | null = null;
  partForm: FormGroup;
  displayDialog: boolean = false;
  isNewPart: boolean = false;
  loading: boolean = false;

  constructor(
    private partService: PartService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.partForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadParts();
  }

  loadParts(): void {
    this.loading = true;
    this.partService.getParts().subscribe({
      next: (data) => {
        this.parts = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec du chargement des pièces' });
        this.loading = false;
      }
    });
  }

  openNew(): void {
    this.partForm.reset({ name: '', description: '', price: 0 });
    this.selectedPart = null;
    this.isNewPart = true;
    this.displayDialog = true;
  }

  editPart(part: Part): void {
    this.selectedPart = { ...part };
    this.partForm.patchValue({
      name: part.name,
      description: part.description || '',
      price: part.price
    });
    this.isNewPart = false;
    this.displayDialog = true;
  }

  deletePart(part: Part): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette pièce?')) {
      this.loading = true;
      this.partService.deletePart(part._id!).subscribe({
        next: () => {
          this.parts = this.parts.filter(p => p._id !== part._id);
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Pièce supprimée' });
          this.loading = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression' });
          this.loading = false;
        }
      });
    }
  }

  savePart(): void {
    if (this.partForm.invalid) {
      this.partForm.markAllAsTouched();
      return;
    }

    const partData: Part = {
      name: this.partForm.value.name,
      description: this.partForm.value.description,
      price: this.partForm.value.price
    };

    this.loading = true;

    if (this.isNewPart) {
      this.partService.createPart(partData).subscribe({
        next: (newPart) => {
          this.parts.push(newPart);
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Pièce créée' });
          this.displayDialog = false;
          this.loading = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la création' });
          this.loading = false;
        }
      });
    } else {
      const updatedPart: Part = {
        ...partData,
        _id: this.selectedPart!._id
      };

      this.partService.updatePart(updatedPart).subscribe({
        next: (updated) => {
          const index = this.parts.findIndex(p => p._id === updated._id);
          if (index !== -1) {
            this.parts[index] = updated;
          }
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Pièce mise à jour' });
          this.displayDialog = false;
          this.loading = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la mise à jour' });
          this.loading = false;
        }
      });
    }
  }

  hideDialog(): void {
    this.displayDialog = false;
  }
}
