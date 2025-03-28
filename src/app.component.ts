import { ToastModule } from 'primeng/toast';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule,ToastModule],
    providers: [MessageService],
    template: `
    <p-toast position="bottom-center"></p-toast>
    <router-outlet></router-outlet>
`
})
export class AppComponent {}
