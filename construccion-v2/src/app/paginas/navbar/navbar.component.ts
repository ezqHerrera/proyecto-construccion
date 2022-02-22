import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { CambiosService } from '../../services/cambios.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public logueado: boolean = false;
  public email: string = '';

  constructor(private auth:AuthService, private fb:FormBuilder, private cambiosService:CambiosService) {}

  ngOnInit(): void {

    this.auth.user.subscribe((user) => {
      if (user) {
        this.logueado = true;
        this.email = user.email;
      } else {
        this.logueado = false;
      }
    })
  }

  cerrarSesion() {
    this.auth.logOut().then(() => {
      alert("Se ha cerrado sesión.");
    }).catch(() => {
      alert("No se ha podido cerrar sesión.");
    })
  }

}
