import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginBoComponent } from './login-bo/login-bo.component';
import { NotAuthorizedComponent } from './not-authorized';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent
    },
    {
        path: 'bo',
        component: LoginBoComponent
    },
    {
        path: 'not-authorized',
        component: NotAuthorizedComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
