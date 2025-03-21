import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';

interface Service {
    id: number;
    name: string;
    description: string;
    icon: string;
    price: number;
}

interface Testimonial {
    id: number;
    customer: string;
    rating: number;
    comment: string;
    date: Date;
    vehicle: string;
}

interface PromotionCard {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    buttonLabel: string;
    expiry?: Date;
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, CardModule, DividerModule, CarouselModule, TagModule, ProgressBarModule, RippleModule],
    template: `
        <!-- Hero Section -->
        <div class="hero-section relative">
            <div class="bg-gradient-to-r from-blue-400 to-blue-200 py-16 md:py-24 px-4">
                <div class="max-w-7xl mx-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div class="text-white">
                            <h1 class="text-3xl md:text-5xl font-bold mb-4">Votre véhicule mérite le meilleur service</h1>
                            <p class="text-lg md:text-xl mb-6 text-blue-100">Des experts passionnés pour l'entretien et la réparation de votre voiture. Prenez rendez-vous en quelques clics.</p>
                            <div class="flex flex-col sm:flex-row gap-4">
                                <button pButton label="Prendre rendez-vous" icon="pi pi-calendar-plus" class="p-button-lg" [routerLink]="['client/appointment']"></button>
                                <button pButton label="Nos services" icon="pi pi-list" class="p-button-outlined p-button-lg p-button-secondary" [routerLink]="['/services']" pRipple></button>
                            </div>
                        </div>
                        <div class="text-center hidden md:block">
                            <img src="/assets/images/1.jpg" alt="Atelier mécanique" class="rounded-lg shadow-lg max-w-full" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bannière d'information -->
            <div class="max-w-7xl mx-auto px-4 -mt-6 md:-mt-10 relative z-10">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div *ngFor="let info of infoBoxes" class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
                        <i [class]="info.icon + ' text-4xl text-blue-600 mb-4'"></i>
                        <h3 class="text-lg font-bold text-gray-800 mb-1">{{ info.title }}</h3>
                        <p class="text-gray-600">{{ info.description }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section Services Populaires -->
        <section class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Nos services populaires</h2>
                    <p class="text-lg text-gray-600 max-w-3xl mx-auto">Des solutions adaptées à tous vos besoins automobiles, avec des experts qualifiés et des équipements de pointe.</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div *ngFor="let service of popularServices" class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                        <div class="bg-gradient-to-r from-blue-700 to-blue-500 h-2"></div>
                        <div class="p-6">
                            <div class="flex items-center mb-4">
                                <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <i [class]="service.icon + ' text-2xl text-blue-600'"></i>
                                </div>
                                <h3 class="text-xl font-bold text-gray-800 ml-4">{{ service.name }}</h3>
                            </div>
                            <p class="text-gray-600 mb-6">{{ service.description }}</p>
                            <div class="flex justify-between items-center">
                                <span class="text-lg font-bold text-blue-600">{{ service.price }}€</span>
                                <button pButton label="Réserver" class="p-button-sm" icon="pi pi-arrow-right" iconPos="right" [routerLink]="['/rendez-vous']"></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-10">
                    <button pButton label="Voir tous nos services" icon="pi pi-external-link" class="p-button-outlined" [routerLink]="['/services']"></button>
                </div>
            </div>
        </section>

        <!-- Section Promotions -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4">
                <div class="text-center mb-10">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Offres spéciales</h2>
                    <p class="text-lg text-gray-600 max-w-3xl mx-auto">Profitez de nos promotions exclusives et économisez sur vos services auto.</p>
                </div>

                <p-carousel [value]="promotions" [numVisible]="1" [numScroll]="1" [circular]="true" [responsiveOptions]="responsiveOptions" [autoplayInterval]="5000" styleClass="custom-carousel">
                    <ng-template let-promo pTemplate="item">
                        <div class="p-4">
                            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div class="grid grid-cols-1 md:grid-cols-2">
                                    <div class="h-60 md:h-auto bg-gray-200 relative overflow-hidden">
                                        <img src="/api/placeholder/600/400" [alt]="promo.title" class="w-full h-full object-cover" />
                                        <div *ngIf="promo.expiry" class="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">Expire le {{ promo.expiry | date: 'dd/MM/yyyy' }}</div>
                                    </div>
                                    <div class="p-6 md:p-8 flex flex-col">
                                        <h3 class="text-2xl font-bold text-gray-800 mb-3">{{ promo.title }}</h3>
                                        <p class="text-gray-600 mb-6 flex-grow">{{ promo.description }}</p>
                                        <button pButton [label]="promo.buttonLabel" icon="pi pi-tag" class="p-button-lg" [routerLink]="['/rendez-vous']"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ng-template>
                </p-carousel>
            </div>
        </section>

        <!-- Section Témoignages -->
        <section class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4">
                <div class="text-center mb-10">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Ce que disent nos clients</h2>
                    <p class="text-lg text-gray-600 max-w-3xl mx-auto">Découvrez pourquoi nos clients nous font confiance pour l'entretien de leurs véhicules.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div *ngFor="let testimonial of testimonials" class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {{ testimonial.customer.charAt(0) }}
                            </div>
                            <div class="ml-3">
                                <h4 class="font-bold text-gray-800">{{ testimonial.customer }}</h4>
                                <p class="text-sm text-gray-500">{{ testimonial.vehicle }}</p>
                            </div>
                        </div>
                        <div class="mb-4">
                            <div class="flex mb-2">
                                <i *ngFor="let i of [1, 2, 3, 4, 5]" class="pi" [ngClass]="i <= testimonial.rating ? 'pi-star-fill text-yellow-400' : 'pi-star text-gray-300'"> </i>
                            </div>
                            <p class="italic text-gray-600">"{{ testimonial.comment }}"</p>
                        </div>
                        <div class="text-sm text-gray-500">
                            {{ testimonial.date | date: 'dd MMMM yyyy' }}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section Pourquoi nous choisir -->
        <section class="py-16 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <div class="max-w-7xl mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold mb-4">Pourquoi nous choisir ?</h2>
                    <p class="text-lg text-blue-100 max-w-3xl mx-auto">Notre engagement pour la qualité et la satisfaction client nous distingue depuis plus de 15 ans.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div *ngFor="let reason of whyChooseUs" class="bg-blue-700 bg-opacity-50 p-6 rounded-lg hover:bg-opacity-70 transition-colors duration-300">
                        <div class="text-center">
                            <i [class]="reason.icon + ' text-4xl mb-4 text-blue-200'"></i>
                            <h3 class="text-xl text-blue-200 font-bold mb-3">{{ reason.title }}</h3>
                            <p class="text-blue-100">{{ reason.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section FAQ -->
        <section class="py-16 bg-white">
            <div class="max-w-5xl mx-auto px-4">
                <div class="text-center mb-10">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Questions fréquentes</h2>
                    <p class="text-lg text-gray-600">Trouvez rapidement des réponses à vos questions concernant nos services.</p>
                </div>

                <div class="space-y-4">
                    <div *ngFor="let faq of faqs; let i = index" class="border rounded-lg overflow-hidden">
                        <div class="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors" (click)="toggleFaq(i)">
                            <h3 class="font-medium text-gray-800">{{ faq.question }}</h3>
                            <i class="pi" [ngClass]="faq.isOpen ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                        </div>
                        <div class="p-4 bg-white" [ngClass]="{ hidden: !faq.isOpen }">
                            <p class="text-gray-600">{{ faq.answer }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section CTA -->
        <section class="py-16 bg-gradient-to-r from-blue-400 to-blue-200 text-blue-900">
            <div class="max-w-5xl mx-auto px-4 text-center">
                <h2 class="text-3xl font-bold mb-6">Prêt à prendre soin de votre véhicule ?</h2>
                <p class="text-xl mb-8 max-w-3xl mx-auto">Planifiez votre rendez-vous dès maintenant et bénéficiez de notre expertise automobile pour garder votre véhicule en parfait état.</p>
                <button pButton label="Prendre rendez-vous" icon="pi pi-calendar-plus" class="p-button-lg" [routerLink]="['/client/appointment']"></button>
            </div>
        </section>
    `,
    styles: [
        `
            :host ::ng-deep .custom-carousel .p-carousel-indicators {
                margin-top: 1rem;
            }

            :host ::ng-deep .custom-carousel .p-carousel-indicator > button {
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
            }

            :host ::ng-deep .p-button.p-button-lg {
                padding: 0.75rem 1.25rem;
                font-size: 1.125rem;
            }

            .hero-section {
                margin-bottom: 4rem;
            }
        `
    ]
})
export class HomeComponent implements OnInit {
    infoBoxes = [
        {
            icon: 'pi pi-check-circle',
            title: 'Service Certifié',
            description: 'Techniciens certifiés et formés aux dernières technologies'
        },
        {
            icon: 'pi pi-clock',
            title: 'Rapidité',
            description: 'Interventions rapides et efficaces pour minimiser votre attente'
        },
        {
            icon: 'pi pi-wallet',
            title: 'Prix Transparents',
            description: 'Devis détaillés sans surprise et prix compétitifs'
        },
        {
            icon: 'pi pi-shield',
            title: 'Garantie',
            description: 'Toutes nos réparations sont garanties pendant 12 mois'
        }
    ];

    popularServices: Service[] = [
        {
            id: 1,
            name: 'Révision Complète',
            description: 'Maintenez votre véhicule en parfait état avec notre révision complète incluant 30 points de contrôle.',
            icon: 'pi pi-cog',
            price: 129
        },
        {
            id: 2,
            name: 'Changement de Freins',
            description: 'Assurez votre sécurité avec un système de freinage performant. Remplacement des plaquettes et/ou disques.',
            icon: 'pi pi-stop-circle',
            price: 199
        },
        {
            id: 3,
            name: 'Vidange et Filtres',
            description: 'Prolongez la durée de vie de votre moteur avec une vidange régulière et le remplacement des filtres.',
            icon: 'pi pi-filter',
            price: 89
        }
    ];

    promotions: PromotionCard[] = [
        {
            id: 1,
            title: 'Offre de Printemps',
            description: 'Bénéficiez de -20% sur votre révision complète et préparez votre véhicule pour les beaux jours.',
            imageUrl: 'assets/promo-spring.jpg',
            buttonLabel: 'En profiter',
            expiry: new Date('2025-06-30')
        },
        {
            id: 2,
            title: 'Pack Sécurité',
            description: 'Freins + Amortisseurs + Pneus : économisez 15% sur ce pack complet pour une sécurité optimale.',
            imageUrl: 'assets/promo-safety.jpg',
            buttonLabel: 'Réserver maintenant'
        },
        {
            id: 3,
            title: 'Diagnostic Offert',
            description: 'Pour tout rendez-vous pris en ligne, le diagnostic électronique complet de votre véhicule est offert.',
            imageUrl: 'assets/promo-diagnostic.jpg',
            buttonLabel: 'Prendre rendez-vous'
        }
    ];

    testimonials: Testimonial[] = [
        {
            id: 1,
            customer: 'Martin Dupont',
            rating: 5,
            comment: "Service impeccable et rapide. L'équipe est professionnelle et transparente. Je recommande vivement !",
            date: new Date('2025-02-15'),
            vehicle: 'Peugeot 308'
        },
        {
            id: 2,
            customer: 'Sophie Martin',
            rating: 4,
            comment: "Très satisfaite du service. Les prix sont raisonnables et le travail est de qualité. Petit bémol sur le délai d'attente.",
            date: new Date('2025-01-22'),
            vehicle: 'Renault Clio'
        },
        {
            id: 3,
            customer: 'Jean Leblanc',
            rating: 5,
            comment: "Je confie mon véhicule à cette équipe depuis des années et je n'ai jamais été déçu. Un grand merci aux techniciens !",
            date: new Date('2025-02-03'),
            vehicle: 'Citroën C4'
        }
    ];

    whyChooseUs = [
        {
            icon: 'pi pi-users',
            title: 'Expertise',
            description: "Une équipe de techniciens certifiés avec plus de 10 ans d'expérience"
        },
        {
            icon: 'pi pi-thumbs-up',
            title: 'Qualité',
            description: "Utilisation exclusive de pièces d'origine ou de qualité équivalente"
        },
        {
            icon: 'pi pi-sync',
            title: 'Efficacité',
            description: "Interventions rapides pour minimiser votre temps d'immobilisation"
        },
        {
            icon: 'pi pi-heart',
            title: 'Satisfaction',
            description: '96% de nos clients sont satisfaits et nous recommandent'
        }
    ];

    faqs = [
        {
            question: 'Combien de temps dure une révision standard ?',
            answer: "Une révision standard prend généralement entre 1h30 et 2h selon le modèle de votre véhicule. Nous vous proposons un service de navette ou une voiture de courtoisie pendant l'intervention.",
            isOpen: true
        },
        {
            question: 'Puis-je annuler ou reporter mon rendez-vous ?',
            answer: "Oui, vous pouvez annuler ou reporter votre rendez-vous jusqu'à 24h à l'avance sans frais. Connectez-vous simplement à votre compte ou appelez-nous.",
            isOpen: false
        },
        {
            question: 'Quels modes de paiement acceptez-vous ?',
            answer: 'Nous acceptons les paiements par carte bancaire, espèces, chèque et virement. Nous proposons également des solutions de financement pour les réparations importantes.',
            isOpen: false
        },
        {
            question: 'Est-ce que vous travaillez sur toutes les marques de véhicules ?',
            answer: "Oui, notre garage est multi-marques. Nos techniciens sont formés pour intervenir sur tous types de véhicules, qu'ils soient français ou étrangers.",
            isOpen: false
        },
        {
            question: 'Les pièces remplacées sont-elles garanties ?',
            answer: 'Absolument, toutes les pièces que nous installons sont garanties pendant 12 mois minimum, et nos interventions sont garanties pendant la même période.',
            isOpen: false
        }
    ];

    responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    constructor() {}

    ngOnInit() {}

    toggleFaq(index: number) {
        this.faqs[index].isOpen = !this.faqs[index].isOpen;
    }
}
