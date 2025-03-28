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
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { ChipModule } from 'primeng/chip';

interface Mecanicien {
    id: number;
    nom: string;
    prenom: string;
    specialite: string;
    disponible: boolean;
}

interface Appointment {
    id: number;
    clientName: string;
    clientPhone: string;
    vehicleModel: string;
    vehiclePlate: string;
    serviceTypes: string[];
    appointmentDate: Date;
    duration: number; // en minutes
    status: string;
    notes: string;
    mechanicIds: number[];
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
    imports: [CommonModule, CalendarModule, FullCalendarModule, InputTextModule, DropdownModule, ButtonModule,
        DialogModule, TabsModule, AccordionModule, CheckboxModule, SelectButtonModule, ColorPickerModule,
        ToastModule, CardModule, FormsModule, SelectModule, ChipModule, MultiSelectModule, InputNumberModule]
})
export class PlanningGlobalComponent implements OnInit {
    mecaniciens: Mecanicien[] = [];
    appointments: Appointment[] = [];
    plagesSpeciales: PlageSpeciale[] = [];
    absences: Absence[] = [];

    events: any[] = [];
    options: any;

    affichage: 'jour' | 'semaine' | 'mois' | 'liste' = 'semaine';
    dateActuelle: Date = new Date();

    selectedEvent: any = null;
    selectedMecanicien: Mecanicien | null = null;

    dialogVisible: boolean = false;
    absenceDialogVisible: boolean = false;
    plageSpecialeDialogVisible: boolean = false;

    nouveauTypeEvenement: 'appointment' | 'absence' | 'plageSpeciale' = 'appointment';

    nouvelAppointment: Appointment = this.initialiserNouvelAppointment();
    nouvelleAbsence: Absence = this.initialiserNouvelleAbsence();
    nouvellePlageSpeciale: PlageSpeciale = this.initialiserNouvellePlageSpeciale();

    statutOptions = [
        { label: 'Programmé', value: 'programmé' },
        { label: 'Confirmé', value: 'confirmé' },
        { label: 'En cours', value: 'en cours' },
        { label: 'Terminé', value: 'terminé' },
        { label: 'Annulé', value: 'annulé' }
    ];

    typeServicesOptions = [
        { label: 'Vidange', value: 'vidange' },
        { label: 'Révision', value: 'revision' },
        { label: 'Freins', value: 'freins' },
        { label: 'Diagnostique', value: 'diagnostique' },
        { label: 'Électronique', value: 'electronique' },
        { label: 'Carrosserie', value: 'carrosserie' },
        { label: 'Pneus', value: 'pneus' },
        { label: 'Climatisation', value: 'climatisation' },
        { label: 'Autre', value: 'autre' }
    ];

    constructor(private messageService: MessageService) {}

    ngOnInit() {
        this.chargerDonnees();
        this.initialiserCalendrier();
    }

    initialiserNouvelAppointment(): Appointment {
        const dateDebut = new Date();
        return {
            id: 0,
            clientName: '',
            clientPhone: '',
            vehicleModel: '',
            vehiclePlate: '',
            serviceTypes: [],
            appointmentDate: dateDebut,
            duration: 60,
            status: 'programmé',
            notes: '',
            mechanicIds: []
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

        this.appointments = [
            {
                id: 1,
                clientName: 'Durand Robert',
                clientPhone: '06 12 34 56 78',
                vehicleModel: 'Peugeot 308',
                vehiclePlate: 'AB-123-CD',
                serviceTypes: ['vidange', 'revision'],
                appointmentDate: new Date(new Date().setHours(9, 0, 0, 0)),
                duration: 120,
                status: 'programmé',
                notes: 'Vidange complète et changement des filtres',
                mechanicIds: [1]
            },
            {
                id: 2,
                clientName: 'Moreau Alice',
                clientPhone: '06 98 76 54 32',
                vehicleModel: 'Renault Clio',
                vehiclePlate: 'XY-789-ZA',
                serviceTypes: ['electronique'],
                appointmentDate: new Date(new Date().setHours(14, 0, 0, 0)),
                duration: 180,
                status: 'confirmé',
                notes: 'Remplacement alternateur défectueux',
                mechanicIds: [2, 4]
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

        // Ajouter les rendez-vous
        this.appointments.forEach((appointment) => {
            // Calculer la date de fin à partir de la date de début et de la durée
            const dateDebut = new Date(appointment.appointmentDate);
            const dateFin = new Date(dateDebut.getTime() + appointment.duration * 60000);

            // Récupérer les noms des mécaniciens assignés
            const mecaniciensNoms = appointment.mechanicIds.map(id => {
                const mecanicien = this.mecaniciens.find(m => m.id === id);
                return mecanicien ? `${mecanicien.prenom} ${mecanicien.nom}` : '';
            }).filter(nom => nom).join(', ');

            // Récupérer les types de service en format lisible
            const servicesLibelles = appointment.serviceTypes.map(code => {
                const service = this.typeServicesOptions.find(s => s.value === code);
                return service ? service.label : code;
            }).join(', ');

            // Déterminer la couleur en fonction du statut
            let backgroundColor = '#2196F3'; // couleur par défaut (bleu)

            if (appointment.status === 'confirmé') {
                backgroundColor = '#4CAF50'; // vert
            } else if (appointment.status === 'en cours') {
                backgroundColor = '#FF9800'; // orange
            } else if (appointment.status === 'terminé') {
                backgroundColor = '#607D8B'; // gris
            } else if (appointment.status === 'annulé') {
                backgroundColor = '#F44336'; // rouge
            }

            this.events.push({
                id: `appointment_${appointment.id}`,
                title: `${appointment.clientName} - ${appointment.vehicleModel}`,
                start: dateDebut,
                end: dateFin,
                backgroundColor: backgroundColor,
                borderColor: backgroundColor,
                textColor: '#ffffff',
                extendedProps: {
                    type: 'appointment',
                    appointment: appointment,
                    mecaniciensNoms: mecaniciensNoms,
                    services: servicesLibelles,
                    description: appointment.notes
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

    initialiserCalendrier() {
        this.options = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialDate: this.dateActuelle,
            initialView: 'timeGridWeek',
            locale: 'fr',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
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
        this.nouveauTypeEvenement = 'appointment';
        this.nouvelAppointment = this.initialiserNouvelAppointment();
        this.nouvelAppointment.appointmentDate = selectInfo.start;

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

        if (eventType === 'appointment') {
            this.nouvelAppointment = { ...this.selectedEvent.extendedProps.appointment };
            this.nouveauTypeEvenement = 'appointment';
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
        const newEnd = eventDropInfo.event.end;

        if (eventType === 'appointment') {
            const appointmentId = parseInt(eventDropInfo.event.id.split('_')[1]);
            const appointment = this.appointments.find((i) => i.id === appointmentId);
            if (appointment) {
                appointment.appointmentDate = newStart;
                // Recalculer la durée en minutes si la date de fin a changé
                if (newEnd) {
                    const durationMs = newEnd.getTime() - newStart.getTime();
                    appointment.duration = durationMs / 60000; // Convertir millisecondes en minutes
                }
                this.verifierConflitHoraire(appointment);
            }
        } else if (eventType === 'absence') {
            const absenceId = parseInt(eventDropInfo.event.id.split('_')[1]);
            const absence = this.absences.find((a) => a.id === absenceId);
            if (absence) {
                absence.dateDebut = newStart;
                absence.dateFin = newEnd || newStart;
            }
        } else if (eventType === 'plageSpeciale') {
            const plageId = parseInt(eventDropInfo.event.id.split('_')[1]);
            const plage = this.plagesSpeciales.find((p) => p.id === plageId);
            if (plage) {
                plage.dateDebut = newStart;
                plage.dateFin = newEnd || newStart;
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
        const start = eventResizeInfo.event.start;

        if (eventType === 'appointment') {
            const appointmentId = parseInt(eventResizeInfo.event.id.split('_')[1]);
            const appointment = this.appointments.find((i) => i.id === appointmentId);
            if (appointment && newEnd) {
                // Recalculer la durée en minutes
                const durationMs = newEnd.getTime() - start.getTime();
                appointment.duration = durationMs / 60000; // Convertir millisecondes en minutes
                this.verifierConflitHoraire(appointment);
            }
        } else if (eventType === 'absence') {
            const absenceId = parseInt(eventResizeInfo.event.id.split('_')[1]);
            const absence = this.absences.find((a) => a.id === absenceId);
            if (absence && newEnd) {
                absence.dateFin = newEnd;
            }
        } else if (eventType === 'plageSpeciale') {
            const plageId = parseInt(eventResizeInfo.event.id.split('_')[1]);
            const plage = this.plagesSpeciales.find((p) => p.id === plageId);
            if (plage && newEnd) {
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
        if (this.nouveauTypeEvenement === 'appointment') {
            this.sauvegarderAppointment();
        } else if (this.nouveauTypeEvenement === 'absence') {
            this.sauvegarderAbsence();
        } else if (this.nouveauTypeEvenement === 'plageSpeciale') {
            this.sauvegarderPlageSpeciale();
        }

        this.dialogVisible = false;
        this.selectedEvent = null;
    }

    sauvegarderAppointment() {
        if (this.nouvelAppointment.id === 0) {
            // Nouveau rendez-vous
            const maxId = this.appointments.reduce((max, item) => (item.id > max ? item.id : max), 0);
            this.nouvelAppointment.id = maxId + 1;
            this.appointments.push({ ...this.nouvelAppointment });
            this.messageService.add({
                severity: 'success',
                summary: 'Rendez-vous créé',
                detail: 'Nouveau rendez-vous ajouté au planning'
            });
        } else {
            // Modification d'un rendez-vous existant
            const index = this.appointments.findIndex((i) => i.id === this.nouvelAppointment.id);
            if (index !== -1) {
                this.appointments[index] = { ...this.nouvelAppointment };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Rendez-vous mis à jour',
                    detail: 'Rendez-vous modifié avec succès'
                });
            }
        }

        this.verifierConflitHoraire(this.nouvelAppointment);
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

        if (eventType === 'appointment') {
            this.appointments = this.appointments.filter((i) => i.id !== eventId);
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

    verifierConflitHoraire(appointment: Appointment) {
        if (!appointment.mechanicIds || appointment.mechanicIds.length === 0) return;

        const dateDebut = new Date(appointment.appointmentDate);
        const dateFin = new Date(dateDebut.getTime() + appointment.duration * 60000);

        // Pour chaque mécanicien assigné
        for (const mechanicId of appointment.mechanicIds) {
            // Vérifier les chevauchements avec d'autres rendez-vous
            const conflits = this.appointments.filter(
                (a) =>
                    a.id !== appointment.id &&
                    a.mechanicIds.includes(mechanicId) &&
                    this.checkTimeOverlap(
                        a.appointmentDate,
                        new Date(new Date(a.appointmentDate).getTime() + a.duration * 60000),
                        dateDebut,
                        dateFin
                    )
            );

            // Vérifier les absences
            const absenceConflits = this.absences.filter(
                (a) =>
                    a.mecanicienId === mechanicId &&
                    this.checkTimeOverlap(
                        a.dateDebut,
                        a.dateFin,
                        dateDebut,
                        dateFin
                    )
            );

            if (conflits.length > 0 || absenceConflits.length > 0) {
                const mecanicien = this.mecaniciens.find(m => m.id === mechanicId);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Conflit détecté',
                    detail: `Attention: ${mecanicien?.prenom} ${mecanicien?.nom} a déjà des rendez-vous ou absences programmés sur cette plage horaire`,
                    sticky: true
                });
            }
        }
    }

    checkTimeOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
        return (start1 <= start2 && end1 > start2) ||
               (start1 < end2 && end1 >= end2) ||
               (start1 >= start2 && end1 <= end2);
    }

    fermerDialog() {
        this.dialogVisible = false;
        this.selectedEvent = null;
    }

    changerAffichage(vue: 'jour' | 'semaine' | 'mois' | 'liste') {
        this.affichage = vue;

        if (vue === 'jour') {
            this.options.initialView = 'timeGridDay';
        } else if (vue === 'semaine') {
            this.options.initialView = 'timeGridWeek';
        } else if (vue === 'mois') {
            this.options.initialView = 'dayGridMonth';
        } else if (vue === 'liste') {
            this.options.initialView = 'listWeek';
        }

        // Forcer la mise à jour du calendrier
        this.options = { ...this.options };
    }

    get activeTabIndex(): number {
        return this.nouveauTypeEvenement === 'appointment' ? 0 : this.nouveauTypeEvenement === 'absence' ? 1 : 2;
    }
}
