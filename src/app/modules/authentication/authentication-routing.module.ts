import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginBoComponent } from './login-bo/login-bo.component';
import { NotAuthorizedComponent } from './not-authorized';
import { LoginMecaComponent } from './login-meca/login-meca.component';

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
    },
    {
        path:'bo-meca',
        component: LoginMecaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
