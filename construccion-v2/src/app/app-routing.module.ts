import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  { path:'inicio', component:InicioComponent },
  { path: 'login', component:LoginComponent },
  { path:'', redirectTo:'inicio', pathMatch:"full" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation:"ignore",
      anchorScrolling:'enabled',
      scrollPositionRestoration:'enabled'
  })
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
