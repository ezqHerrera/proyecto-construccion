import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user!: Observable<any>;

  constructor(private auth: AngularFireAuth) {
    this.user = this.auth.authState
  }

  //Método de inicio de sesión
  /**
   * Parámetros necesarios:
   *  username: e-mail -> string
   *  password: string
  */
  login(username:string, password:string){

    return this.auth.signInWithEmailAndPassword(username,password);

  }

  //Método de cierre de sesión en Firebase
  /**
   * Sin parámetros necesarios.
   */
  logOut(){
    return this.auth.signOut();
  }

  currentUser(){
    this.auth.authState;
  }
}
