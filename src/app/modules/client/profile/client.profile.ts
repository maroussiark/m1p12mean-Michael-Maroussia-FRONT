import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Tag } from 'primeng/tag';
import { Product, ProductService } from '../../../pages/service/product.service';

@Component({
    selector: 'client-profile',
    imports: [Button, Divider, CommonModule, Tag],
    standalone: true,
    providers: [ProductService],
    template: `
        <div class="card mt-8">
            <div class="font-semibold text-xl mb-4">Profile</div>
            <div class="flex flex-col md:flex-row">
                <div class="w-full md:w-5/12 flex flex-col items-center justify-center gap-3 py-5">
                    <div class="flex flex-col gap-2">
                        <label for="username">Username</label>
                        <input pInputText id="username" type="text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="password">Password</label>
                        <input pInputText id="password" type="password" />
                    </div>
                    <div class="flex">
                        <p-button label="Login" icon="pi pi-user" class="w-full max-w-[17.35rem] mx-auto"></p-button>
                    </div>
                </div>
                <div class="w-full md:w-2/12">
                    <p-divider layout="vertical" class="!hidden md:!flex"><b>ET</b></p-divider>
                </div>
                <div class="w-full md:w-5/12 flex items-center justify-center py-5">
                    <ng-template #list let-items>
                        <div class="flex flex-col">
                            <div *ngFor="let item of items; let i = index">
                                <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" [ngClass]="{ 'border-t border-surface': i !== 0 }">
                                    <div class="md:w-40 relative">
                                        <img class="block xl:block mx-auto rounded w-full" src="https://primefaces.org/cdn/primevue/images/product/{{ item.image }}" [alt]="item.name" />
                                        <div class="absolute bg-black/70 rounded-border" [style]="{ left: '4px', top: '4px' }">
                                            <p-tag [value]="item.inventoryStatus"></p-tag>
                                        </div>
                                    </div>
                                    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                        <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                            <div>
                                                <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category }}</span>
                                                <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                                            </div>
                                            <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                                <div
                                                    class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                                                    style="
                                                    border-radius: 30px;
                                                    box-shadow:
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                                                "
                                                >
                                                    <span class="text-surface-900 font-medium text-sm">{{ item.rating }}</span>
                                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col md:items-end gap-8">
                                            <span class="text-xl font-semibold">$ {{ item.price }}</span>
                                            <div class="flex flex-row-reverse md:flex-row gap-2">
                                                <p-button icon="pi pi-heart" styleClass="h-full" [outlined]="true"></p-button>
                                                <p-button icon="pi pi-shopping-cart" label="Buy Now" [disabled]="item.inventoryStatus === 'OUTOFSTOCK'" styleClass="flex-auto md:flex-initial whitespace-nowrap"></p-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ng-template>
                </div>
            </div>
        </div>
    `
})
export class ClientProfile {
    layout!: 'list' ;
    products: Product[] = [];
    constructor(private productService: ProductService) {}
    ngOnInit() {
        this.productService.getProductsSmall().then((data) => (this.products = data.slice(0, 6)));
    }
}
