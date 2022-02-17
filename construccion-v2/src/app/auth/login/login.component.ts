import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formularioLogin: FormGroup;

  constructor(private fb:FormBuilder, private auth:AuthService, private router:Router) {

    //Inicializo mi formulario.
    this.formularioLogin = fb.group({
      username:['', [Validators.required,Validators.email]],
      password:['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  iniciarSesion(){

    //Preguntamos si el formulario es válido.
    if(!this.formularioLogin.invalid){

      //Obtengo esos datos del formulario.
      const {username, password} = this.formularioLogin.value;
      //Inicio sesión en Firebase llamando al método de mi servicio.
      this.auth.login(username, password).then((resp) => {
        alert("Inicio de sesión confirmado.");
        this.router.navigateByUrl('inicio')
      }).catch(error => {
        alert("Datos incorrectos, favor de verificar que estos pertenecen a un usuario válido.");
      })
    }
    else{
      alert("Por favor, corrija los datos.");
    }
  }

}
