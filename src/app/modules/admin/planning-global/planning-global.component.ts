// planning-global.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

interface Mecanicien {
    id: number;
    nom: string;
    prenom: string;
    specialite: string;
    disponible: boolean;
}

interface Intervention {
    id: number;
    titre: string;
    description: string;
    dateDebut: Date;
    dateFin: Date;
    mecanicienId: number | null;
    client: string;
    vehicule: string;
    statut: 'programmé' | 'en cours' | 'terminé' | 'annulé';
    priorite: 'basse' | 'normale' | 'haute' | 'urgente';
}

interface PlageSpeciale {
    id: number;
    titre: string;
    description: string;
    dateDebut: Date;
    dateFin: Date;
    couleur: string;
}

interface Absence {
    id: number;
    mecanicienId: number;
    motif: 'congé' | 'maladie' | 'formation' | 'autre';
    dateDebut: Date;
    dateFin: Date;
    description: string;
}

@Component({
    selector: 'app-planning-global',
    templateUrl: './planning-global.component.html',
    styleUrls: ['./planning-global.component.scss'],
    providers: [MessageService],
    imports: [CommonModule, CalendarModule, FullCalendarModule, InputTextModule, DropdownModule, ButtonModule, DialogModule, TabsModule, AccordionModule, CheckboxModule, SelectButtonModule, ColorPickerModule, ToastModule, CardModule, FormsModule,SelectModule]
})
export class PlanningGlobalComponent implements OnInit {
    mecaniciens: Mecanicien[] = [];
    interventions: Intervention[] = [];
    plagesSpeciales: PlageSpeciale[] = [];
    absences: Absence[] = [];

    events: any[] = [];
    options: any;

    affichage: 'jour' | 'semaine' | 'mois' = 'semaine';
    dateActuelle: Date = new Date();

    selectedEvent: any = null;
    selectedMecanicien: Mecanicien | null = null;

    dialogVisible: boolean = false;
    absenceDialogVisible: boolean = false;
    plageSpecialeDialogVisible: boolean = false;

    nouveauTypeEvenement: 'intervention' | 'absence' | 'plageSpeciale' = 'intervention';

    nouvelleIntervention: Intervention = this.initialiserNouvelleIntervention();
    nouvelleAbsence: Absence = this.initialiserNouvelleAbsence();
    nouvellePlageSpeciale: PlageSpeciale = this.initialiserNouvellePlageSpeciale();


    constructor(private messageService: MessageService) {}

    ngOnInit() {
        this.chargerDonnees();
        this.initialiserCalendrier();
    }

    initialiserNouvelleIntervention(): Intervention {
        return {
            id: 0,
            titre: '',
            description: '',
            dateDebut: new Date(),
            dateFin: new Date(new Date().setHours(new Date().getHours() + 2)),
            mecanicienId: null,
            client: '',
            vehicule: '',
            statut: 'programmé',
            priorite: 'normale'
        };
    }

    initialiserNouvelleAbsence(): Absence {
        return {
            id: 0,
            mecanicienId: 0,
            motif: 'congé',
            dateDebut: new Date(),
            dateFin: new Date(new Date().setHours(new Date().getHours() + 24)),
            description: ''
        };
    }

    initialiserNouvellePlageSpeciale(): PlageSpeciale {
        return {
            id: 0,
            titre: '',
            description: '',
            dateDebut: new Date(),
            dateFin: new Date(new Date().setHours(new Date().getHours() + 4)),
            couleur: '#FF9800'
        };
    }

    chargerDonnees() {
        // Simuler le chargement des données depuis une API
        this.mecaniciens = [
            { id: 1, nom: 'Dupont', prenom: 'Jean', specialite: 'Moteur', disponible: true },
            { id: 2, nom: 'Martin', prenom: 'Sophie', specialite: 'Électronique', disponible: true },
            { id: 3, nom: 'Dubois', prenom: 'Pierre', specialite: 'Carrosserie', disponible: true },
            { id: 4, nom: 'Leroy', prenom: 'Marie', specialite: 'Diagnostic', disponible: true }
        ];

        this.interventions = [
            {
                id: 1,
                titre: 'Vidange',
                description: 'Vidange complète et changement des filtres',
                dateDebut: new Date(new Date().setHours(9, 0, 0, 0)),
                dateFin: new Date(new Date().setHours(11, 0, 0, 0)),
                mecanicienId: 1,
                client: 'Durand Robert',
                vehicule: 'Peugeot 308',
                statut: 'programmé',
                priorite: 'normale'
            },
            {
                id: 2,
                titre: 'Réparation alternateur',
                description: 'Remplacement alternateur défectueux',
                dateDebut: new Date(new Date().setHours(14, 0, 0, 0)),
                dateFin: new Date(new Date().setHours(17, 0, 0, 0)),
                mecanicienId: 2,
                client: 'Moreau Alice',
                vehicule: 'Renault Clio',
                statut: 'programmé',
                priorite: 'haute'
            }
        ];

        this.absences = [
            {
                id: 1,
                mecanicienId: 3,
                motif: 'congé',
                dateDebut: new Date(new Date().setDate(new Date().getDate() + 2)),
                dateFin: new Date(new Date().setDate(new Date().getDate() + 4)),
                description: 'Congés annuels'
            }
        ];

        this.plagesSpeciales = [
            {
                id: 1,
                titre: 'Inventaire matériel',
                description: 'Inventaire annuel du matériel et des pièces',
                dateDebut: new Date(new Date().setDate(new Date().getDate() + 5)),
                dateFin: new Date(new Date().setDate(new Date().getDate() + 5)),
                couleur: '#9C27B0'
            }
        ];

        this.mettreAJourEvenements();
    }

    mettreAJourEvenements() {
        this.events = [];

        // Ajouter les interventions
        this.interventions.forEach((intervention) => {
            const mecanicien = this.mecaniciens.find((m) => m.id === intervention.mecanicienId);
            this.events.push({
                id: `intervention_${intervention.id}`,
                title: `${intervention.titre} - ${intervention.client}`,
                start: intervention.dateDebut,
                end: intervention.dateFin,
                backgroundColor: this.getCouleurPriorite(intervention.priorite),
                borderColor: this.getCouleurPriorite(intervention.priorite),
                textColor: '#ffffff',
                extendedProps: {
                    type: 'intervention',
                    intervention: intervention,
                    mecanicienNom: mecanicien ? `${mecanicien.prenom} ${mecanicien.nom}` : 'Non assigné',
                    description: intervention.description
                }
            });
        });

        // Ajouter les absences
        this.absences.forEach((absence) => {
            const mecanicien = this.mecaniciens.find((m) => m.id === absence.mecanicienId);
            if (mecanicien) {
                this.events.push({
                    id: `absence_${absence.id}`,
                    title: `Absence: ${mecanicien.prenom} ${mecanicien.nom}`,
                    start: absence.dateDebut,
                    end: absence.dateFin,
                    backgroundColor: '#607D8B',
                    borderColor: '#455A64',
                    textColor: '#ffffff',
                    extendedProps: {
                        type: 'absence',
                        absence: absence,
                        mecanicienNom: `${mecanicien.prenom} ${mecanicien.nom}`,
                        description: `${absence.motif}: ${absence.description}`
                    }
                });
            }
        });

        // Ajouter les plages spéciales
        this.plagesSpeciales.forEach((plage) => {
            this.events.push({
                id: `plage_${plage.id}`,
                title: plage.titre,
                start: plage.dateDebut,
                end: plage.dateFin,
                backgroundColor: plage.couleur,
                borderColor: plage.couleur,
                textColor: '#ffffff',
                extendedProps: {
                    type: 'plageSpeciale',
                    plageSpeciale: plage,
                    description: plage.description
                }
            });
        });
    }

    getCouleurPriorite(priorite: string): string {
        switch (priorite) {
            case 'basse':
                return '#4CAF50';
            case 'normale':
                return '#2196F3';
            case 'haute':
                return '#FF9800';
            case 'urgente':
                return '#F44336';
            default:
                return '#2196F3';
        }
    }

    initialiserCalendrier() {
        this.options = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialDate: this.dateActuelle,
            initialView: 'timeGridWeek',
            locale: 'fr',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            editable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            },
            slotMinTime: '07:00:00',
            slotMaxTime: '20:00:00',
            allDaySlot: true,
            businessHours: {
                daysOfWeek: [1, 2, 3, 4, 5, 6],
                startTime: '08:00',
                endTime: '18:00'
            },
            select: this.handleDateSelect.bind(this),
            eventClick: this.handleEventClick.bind(this),
            eventDrop: this.handleEventDrop.bind(this),
            eventResize: this.handleEventResize.bind(this)
        };
    }

    handleDateSelect(selectInfo: any) {
        this.nouveauTypeEvenement = 'intervention';
        this.nouvelleIntervention = this.initialiserNouvelleIntervention();
        this.nouvelleIntervention.dateDebut = selectInfo.start;
        this.nouvelleIntervention.dateFin = selectInfo.end;

        this.nouvelleAbsence = this.initialiserNouvelleAbsence();
        this.nouvelleAbsence.dateDebut = selectInfo.start;
        this.nouvelleAbsence.dateFin = selectInfo.end;

        this.nouvellePlageSpeciale = this.initialiserNouvellePlageSpeciale();
        this.nouvellePlageSpeciale.dateDebut = selectInfo.start;
        this.nouvellePlageSpeciale.dateFin = selectInfo.end;

        this.dialogVisible = true;
    }

    handleEventClick(clickInfo: any) {
        this.selectedEvent = clickInfo.event;
        const eventType = this.selectedEvent.extendedProps.type;

        if (eventType === 'intervention') {
            this.nouvelleIntervention = { ...this.selectedEvent.extendedProps.intervention };
            this.nouveauTypeEvenement = 'intervention';
            this.dialogVisible = true;
        } else if (eventType === 'absence') {
            this.nouvelleAbsence = { ...this.selectedEvent.extendedProps.absence };
            this.nouveauTypeEvenement = 'absence';
            this.dialogVisible = true;
        } else if (eventType === 'plageSpeciale') {
            this.nouvellePlageSpeciale = { ...this.selectedEvent.extendedProps.plageSpeciale };
            this.nouveauTypeEvenement = 'plageSpeciale';
            this.dialogVisible = true;
        }
    }

    handleEventDrop(eventDropInfo: any) {
        const eventType = eventDropInfo.event.extendedProps.type;
        const newStart = eventDropInfo.event.start;
        const newEnd = eventDropInfo.event.end || newStart;

        if (eventType === 'intervention') {
            const interventionId = parseInt(eventDropInfo.event.id.split('_')[1]);
            const intervention = this.interventions.find((i) => i.id === interventionId);
            if (intervention) {
                intervention.dateDebut = newStart;
                intervention.dateFin = newEnd;
                this.verifierConflitHoraire(intervention);
            }
        } else if (eventType === 'absence') {
            const absenceId = parseInt(eventDropInfo.event.id.split('_')[1]);
            const absence = this.absences.find((a) => a.id === absenceId);
            if (absence) {
                absence.dateDebut = newStart;
                absence.dateFin = newEnd;
            }
        } else if (eventType === 'plageSpeciale') {
            const plageId = parseInt(eventDropInfo.event.id.split('_')[1]);
            const plage = this.plagesSpeciales.find((p) => p.id === plageId);
            if (plage) {
                plage.dateDebut = newStart;
                plage.dateFin = newEnd;
            }
        }

        this.mettreAJourEvenements();
        this.messageService.add({
            severity: 'success',
            summary: 'Mise à jour',
            detail: 'Planning mis à jour avec succès'
        });
    }

    handleEventResize(eventResizeInfo: any) {
        const eventType = eventResizeInfo.event.extendedProps.type;
        const newEnd = eventResizeInfo.event.end;

        if (eventType === 'intervention') {
            const interventionId = parseInt(eventResizeInfo.event.id.split('_')[1]);
            const intervention = this.interventions.find((i) => i.id === interventionId);
            if (intervention) {
                intervention.dateFin = newEnd;
                this.verifierConflitHoraire(intervention);
            }
        } else if (eventType === 'absence') {
            const absenceId = parseInt(eventResizeInfo.event.id.split('_')[1]);
            const absence = this.absences.find((a) => a.id === absenceId);
            if (absence) {
                absence.dateFin = newEnd;
            }
        } else if (eventType === 'plageSpeciale') {
            const plageId = parseInt(eventResizeInfo.event.id.split('_')[1]);
            const plage = this.plagesSpeciales.find((p) => p.id === plageId);
            if (plage) {
                plage.dateFin = newEnd;
            }
        }

        this.mettreAJourEvenements();
        this.messageService.add({
            severity: 'success',
            summary: 'Mise à jour',
            detail: 'Durée mise à jour avec succès'
        });
    }

    sauvegarderEvenement() {
        if (this.nouveauTypeEvenement === 'intervention') {
            this.sauvegarderIntervention();
        } else if (this.nouveauTypeEvenement === 'absence') {
            this.sauvegarderAbsence();
        } else if (this.nouveauTypeEvenement === 'plageSpeciale') {
            this.sauvegarderPlageSpeciale();
        }

        this.dialogVisible = false;
        this.selectedEvent = null;
    }

    sauvegarderIntervention() {
        if (this.nouvelleIntervention.id === 0) {
            // Nouvelle intervention
            const maxId = this.interventions.reduce((max, item) => (item.id > max ? item.id : max), 0);
            this.nouvelleIntervention.id = maxId + 1;
            this.interventions.push({ ...this.nouvelleIntervention });
            this.messageService.add({
                severity: 'success',
                summary: 'Intervention créée',
                detail: 'Nouvelle intervention ajoutée au planning'
            });
        } else {
            // Modification d'une intervention existante
            const index = this.interventions.findIndex((i) => i.id === this.nouvelleIntervention.id);
            if (index !== -1) {
                this.interventions[index] = { ...this.nouvelleIntervention };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Intervention mise à jour',
                    detail: 'Intervention modifiée avec succès'
                });
            }
        }

        this.verifierConflitHoraire(this.nouvelleIntervention);
        this.mettreAJourEvenements();
    }

    sauvegarderAbsence() {
        if (this.nouvelleAbsence.id === 0) {
            // Nouvelle absence
            const maxId = this.absences.reduce((max, item) => (item.id > max ? item.id : max), 0);
            this.nouvelleAbsence.id = maxId + 1;
            this.absences.push({ ...this.nouvelleAbsence });
            this.messageService.add({
                severity: 'success',
                summary: 'Absence créée',
                detail: 'Nouvelle absence ajoutée au planning'
            });
        } else {
            // Modification d'une absence existante
            const index = this.absences.findIndex((a) => a.id === this.nouvelleAbsence.id);
            if (index !== -1) {
                this.absences[index] = { ...this.nouvelleAbsence };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Absence mise à jour',
                    detail: 'Absence modifiée avec succès'
                });
            }
        }

        this.mettreAJourEvenements();
    }

    sauvegarderPlageSpeciale() {
        if (this.nouvellePlageSpeciale.id === 0) {
            // Nouvelle plage spéciale
            const maxId = this.plagesSpeciales.reduce((max, item) => (item.id > max ? item.id : max), 0);
            this.nouvellePlageSpeciale.id = maxId + 1;
            this.plagesSpeciales.push({ ...this.nouvellePlageSpeciale });
            this.messageService.add({
                severity: 'success',
                summary: 'Plage spéciale créée',
                detail: 'Nouvelle plage spéciale ajoutée au planning'
            });
        } else {
            // Modification d'une plage spéciale existante
            const index = this.plagesSpeciales.findIndex((p) => p.id === this.nouvellePlageSpeciale.id);
            if (index !== -1) {
                this.plagesSpeciales[index] = { ...this.nouvellePlageSpeciale };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Plage spéciale mise à jour',
                    detail: 'Plage spéciale modifiée avec succès'
                });
            }
        }

        this.mettreAJourEvenements();
    }

    supprimerEvenement() {
        if (!this.selectedEvent) return;

        const eventType = this.selectedEvent.extendedProps.type;
        const eventId = parseInt(this.selectedEvent.id.split('_')[1]);

        if (eventType === 'intervention') {
            this.interventions = this.interventions.filter((i) => i.id !== eventId);
        } else if (eventType === 'absence') {
            this.absences = this.absences.filter((a) => a.id !== eventId);
        } else if (eventType === 'plageSpeciale') {
            this.plagesSpeciales = this.plagesSpeciales.filter((p) => p.id !== eventId);
        }

        this.mettreAJourEvenements();
        this.dialogVisible = false;
        this.selectedEvent = null;

        this.messageService.add({
            severity: 'success',
            summary: 'Suppression',
            detail: 'Élément supprimé du planning'
        });
    }

    verifierConflitHoraire(intervention: Intervention) {
        if (!intervention.mecanicienId) return;

        // Vérifier les chevauchements avec d'autres interventions
        const conflits = this.interventions.filter(
            (i) =>
                i.id !== intervention.id &&
                i.mecanicienId === intervention.mecanicienId &&
                ((i.dateDebut <= intervention.dateDebut && i.dateFin > intervention.dateDebut) ||
                    (i.dateDebut < intervention.dateFin && i.dateFin >= intervention.dateFin) ||
                    (i.dateDebut >= intervention.dateDebut && i.dateFin <= intervention.dateFin))
        );

        // Vérifier les absences
        const absenceConflits = this.absences.filter(
            (a) =>
                a.mecanicienId === intervention.mecanicienId &&
                ((a.dateDebut <= intervention.dateDebut && a.dateFin > intervention.dateDebut) ||
                    (a.dateDebut < intervention.dateFin && a.dateFin >= intervention.dateFin) ||
                    (a.dateDebut >= intervention.dateDebut && a.dateFin <= intervention.dateFin))
        );

        if (conflits.length > 0 || absenceConflits.length > 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Conflit détecté',
                detail: 'Attention: Le mécanicien a déjà des interventions ou absences programmées sur cette plage horaire',
                sticky: true
            });
        }
    }

    fermerDialog() {
        this.dialogVisible = false;
        this.selectedEvent = null;
    }

    changerAffichage(vue: 'jour' | 'semaine' | 'mois') {
        this.affichage = vue;

        if (vue === 'jour') {
            this.options.initialView = 'timeGridDay';
        } else if (vue === 'semaine') {
            this.options.initialView = 'timeGridWeek';
        } else if (vue === 'mois') {
            this.options.initialView = 'dayGridMonth';
        }

        // Forcer la mise à jour du calendrier
        this.options = { ...this.options };
    }

    get activeTabIndex(): number {
        return this.nouveauTypeEvenement === 'intervention' ? 0 : this.nouveauTypeEvenement === 'absence' ? 1 : 2;
    }
}
