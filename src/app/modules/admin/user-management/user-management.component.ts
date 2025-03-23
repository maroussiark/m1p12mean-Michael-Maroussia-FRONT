// user-management.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    type: string;
    statut: string;
    dateCreation: Date;
    derniereConnexion: Date | null;
}

interface Mecanicien extends User {
    specialites: string[];
    disponibilite: boolean;
    nombreInterventions: number;
}

interface Client extends User {
    vehicules: string[];
    nombreVisites: number;
    valeurTotale: number;
}

interface Activite {
    id: number;
    userId: number;
    userName: string;
    action: string;
    date: Date;
    details: string;
}

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
    providers: [ConfirmationService, MessageService],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // Modules PrimeNG
        TableModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        DialogModule,
        ConfirmDialogModule,
        ToastModule,
        RippleModule,
        ToolbarModule,
        CalendarModule,
        SliderModule,
        MultiSelectModule,
        ChipModule,
        AccordionModule,
        CardModule,
        TimelineModule,
        TooltipModule,
        FieldsetModule,
        CheckboxModule,
        TabsModule,
        SelectModule,
        DatePickerModule
    ]
})
export class UserManagementComponent implements OnInit {
    users: User[] = [];
    mecaniciens: Mecanicien[] = [];
    clients: Client[] = [];
    activites: Activite[] = [];

    filteredUsers: User[] = [];
    selectedUser: User | null = null;
    userForm: FormGroup;

    userDialog: boolean = false;
    deleteUserDialog: boolean = false;
    submitted: boolean = false;

    specialites: any[] = [
        { name: 'Mécanique générale', code: 'MG' },
        { name: 'Électronique', code: 'EL' },
        { name: 'Carrosserie', code: 'CR' },
        { name: 'Climatisation', code: 'CL' },
        { name: 'Pneumatique', code: 'PN' }
    ];

    activeTabIndex: number = 0;
    userTypes = [
        { label: 'Client', value: 'client' },
        { label: 'Mécanicien', value: 'mecanicien' },
        { label: 'Administrateur', value: 'admin' }
    ];

    statuts = [
        { label: 'Actif', value: 'actif' },
        { label: 'Inactif', value: 'inactif' },
        { label: 'En attente', value: 'en_attente' }
    ];

    visiteRange: number[] = [0, 5];
    valeurRange: number[] = [0, 1000];

    expandedRows: { [key: string]: boolean } = {};

    constructor(
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.userForm = this.fb.group({
            id: [null],
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            telephone: ['', Validators.required],
            type: ['client', Validators.required],
            statut: ['actif', Validators.required],
            specialites: [[]],
            vehicules: [[]],
            droitsAcces: this.fb.group({
                gestionClients: [false],
                gestionMecaniciens: [false],
                gestionServices: [false],
                gestionStock: [false],
                gestionFacturation: [false]
            })
        });
    }

    ngOnInit() {
        // Charger les données mockées
        this.loadMockData();
        this.filteredUsers = [...this.users];
    }

    loadMockData() {
        // Users
        this.users = [
            { id: 1, nom: 'Dubois', prenom: 'Jean', email: 'jean.dubois@example.com', telephone: '06 12 34 56 78', type: 'client', statut: 'actif', dateCreation: new Date('2024-09-15'), derniereConnexion: new Date('2025-03-20') },
            { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@example.com', telephone: '06 23 45 67 89', type: 'client', statut: 'actif', dateCreation: new Date('2024-10-05'), derniereConnexion: new Date('2025-03-18') },
            { id: 3, nom: 'Bernard', prenom: 'Thomas', email: 'thomas.bernard@example.com', telephone: '06 34 56 78 90', type: 'mecanicien', statut: 'actif', dateCreation: new Date('2024-08-20'), derniereConnexion: new Date('2025-03-22') },
            { id: 4, nom: 'Petit', prenom: 'Julie', email: 'julie.petit@example.com', telephone: '06 45 67 89 01', type: 'mecanicien', statut: 'actif', dateCreation: new Date('2024-07-12'), derniereConnexion: new Date('2025-03-21') },
            { id: 5, nom: 'Richard', prenom: 'Paul', email: 'paul.richard@example.com', telephone: '06 56 78 90 12', type: 'admin', statut: 'actif', dateCreation: new Date('2024-06-10'), derniereConnexion: new Date('2025-03-23') },
            { id: 6, nom: 'Durand', prenom: 'Claire', email: 'claire.durand@example.com', telephone: '06 67 89 01 23', type: 'client', statut: 'inactif', dateCreation: new Date('2024-08-30'), derniereConnexion: new Date('2025-01-15') }
        ];

        // Mécaniciens
        this.mecaniciens = [
            { ...(this.users.find((u) => u.id === 3) as User), specialites: ['Mécanique générale', 'Électronique'], disponibilite: true, nombreInterventions: 78 },
            { ...(this.users.find((u) => u.id === 4) as User), specialites: ['Carrosserie', 'Pneumatique'], disponibilite: false, nombreInterventions: 65 }
        ];

        // Clients
        this.clients = [
            { ...(this.users.find((u) => u.id === 1) as User), vehicules: ['Renault Clio (2018)', 'Peugeot 3008 (2020)'], nombreVisites: 7, valeurTotale: 1250 },
            { ...(this.users.find((u) => u.id === 2) as User), vehicules: ['Citroën C3 (2019)'], nombreVisites: 4, valeurTotale: 780 },
            { ...(this.users.find((u) => u.id === 6) as User), vehicules: ['BMW Série 1 (2017)'], nombreVisites: 2, valeurTotale: 350 }
        ];

        // Activités
        this.activites = [
            { id: 1, userId: 1, userName: 'Jean Dubois', action: 'Connexion', date: new Date('2025-03-20 09:45'), details: "Connexion depuis l'application mobile" },
            { id: 2, userId: 1, userName: 'Jean Dubois', action: 'Prise de rendez-vous', date: new Date('2025-03-20 09:52'), details: 'Rendez-vous pour révision le 25/03/2025' },
            { id: 3, userId: 3, userName: 'Thomas Bernard', action: 'Mise à jour intervention', date: new Date('2025-03-22 14:30'), details: "Validation d'une réparation de suspension" },
            { id: 4, userId: 4, userName: 'Julie Petit', action: 'Connexion', date: new Date('2025-03-21 08:15'), details: 'Connexion au système' },
            { id: 5, userId: 5, userName: 'Paul Richard', action: 'Modification utilisateur', date: new Date('2025-03-23 11:20'), details: 'Mise à jour des droits pour Julie Petit' }
        ];
    }

    filterUsers(event: any) {
        const query = event.target.value.toLowerCase();
        this.filteredUsers = this.users.filter((user) => user.nom.toLowerCase().includes(query) || user.prenom.toLowerCase().includes(query) || user.email.toLowerCase().includes(query));
    }

    openNew() {
        this.selectedUser = null;
        this.submitted = false;
        this.userForm.reset();
        this.userForm.patchValue({
            type: 'client',
            statut: 'actif',
            specialites: [],
            vehicules: [],
            droitsAcces: {
                gestionClients: false,
                gestionMecaniciens: false,
                gestionServices: false,
                gestionStock: false,
                gestionFacturation: false
            }
        });
        this.userDialog = true;
    }

    editUser(user: User) {
        this.selectedUser = { ...user };
        const isClient = this.clients.find((c) => c.id === user.id);
        const isMecanicien = this.mecaniciens.find((m) => m.id === user.id);

        this.userForm.patchValue({
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            telephone: user.telephone,
            type: user.type,
            statut: user.statut,
            specialites: isMecanicien ? isMecanicien.specialites : [],
            vehicules: isClient ? isClient.vehicules : [],
            droitsAcces: {
                gestionClients: user.type === 'admin',
                gestionMecaniciens: user.type === 'admin',
                gestionServices: user.type === 'admin' || user.type === 'mecanicien',
                gestionStock: user.type === 'admin',
                gestionFacturation: user.type === 'admin'
            }
        });

        this.userDialog = true;
    }

    deleteUser(user: User) {
        this.deleteUserDialog = true;
        this.selectedUser = user;
    }

    confirmDelete() {
        if (this.selectedUser) {
            this.users = this.users.filter((u) => u.id !== this.selectedUser!.id);
            this.clients = this.clients.filter((c) => c.id !== this.selectedUser!.id);
            this.mecaniciens = this.mecaniciens.filter((m) => m.id !== this.selectedUser!.id);

            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur supprimé', life: 3000 });
            this.deleteUserDialog = false;
            this.selectedUser = null;
        }
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    saveUser() {
        this.submitted = true;

        if (this.userForm.invalid) {
            return;
        }

        const formValues = this.userForm.value;
        const newUser: User = {
            id: formValues.id || this.users.length + 1,
            nom: formValues.nom,
            prenom: formValues.prenom,
            email: formValues.email,
            telephone: formValues.telephone,
            type: formValues.type,
            statut: formValues.statut,
            dateCreation: formValues.id ? this.users.find((u) => u.id === formValues.id)?.dateCreation || new Date() : new Date(),
            derniereConnexion: formValues.id ? this.users.find((u) => u.id === formValues.id)?.derniereConnexion || null : null
        };

        if (formValues.id) {
            // Mise à jour
            const index = this.users.findIndex((u) => u.id === formValues.id);
            this.users[index] = newUser;
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur mis à jour', life: 3000 });
        } else {
            // Création
            this.users.push(newUser);
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur créé', life: 3000 });
        }

        // Mise à jour des mécaniciens ou clients selon le type
        if (formValues.type === 'mecanicien') {
            const mecanicien: Mecanicien = {
                ...newUser,
                specialites: formValues.specialites || [],
                disponibilite: true,
                nombreInterventions: 0
            };

            const existingIndex = this.mecaniciens.findIndex((m) => m.id === newUser.id);
            if (existingIndex >= 0) {
                this.mecaniciens[existingIndex] = mecanicien;
            } else {
                this.mecaniciens.push(mecanicien);
            }

            // Supprimer des clients si nécessaire
            this.clients = this.clients.filter((c) => c.id !== newUser.id);
        } else if (formValues.type === 'client') {
            const client: Client = {
                ...newUser,
                vehicules: formValues.vehicules || [],
                nombreVisites: 0,
                valeurTotale: 0
            };

            const existingIndex = this.clients.findIndex((c) => c.id === newUser.id);
            if (existingIndex >= 0) {
                this.clients[existingIndex] = client;
            } else {
                this.clients.push(client);
            }

            // Supprimer des mécaniciens si nécessaire
            this.mecaniciens = this.mecaniciens.filter((m) => m.id !== newUser.id);
        }

        this.userDialog = false;
        this.filteredUsers = [...this.users];
    }

    getUserActivities(userId: number) {
        return this.activites.filter((a) => a.userId === userId);
    }

    getUserStatutClass(statut: string): string {
        switch (statut) {
            case 'actif':
                return 'bg-green-100 text-green-800';
            case 'inactif':
                return 'bg-red-100 text-red-800';
            case 'en_attente':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    onTabChange(event: any) {
        this.activeTabIndex = event.index;
    }

    onRowExpand(event: any) {
        this.expandedRows[event.data.id] = true;
      }

      onRowCollapse(event: any) {
        delete this.expandedRows[event.data.id];
      }

}
