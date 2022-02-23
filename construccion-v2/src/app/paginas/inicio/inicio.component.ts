import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Obra } from 'src/app/models/obra';
import { CambiosService } from '../../services/cambios.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public logueado: boolean = false;
  public email: string = '';

  //Colección de obras
  public obras: Obra[] = [];
  public editar : boolean = false;
  public obraSeleccionada?: Obra;
  public pathImagen : string = '';

  //Imagen
  private file?:File;

  pUpload!: Observable<number|undefined>
  urlImage!: Observable<string>

  public obrasForm:FormGroup
  constructor(private auth:AuthService, private storage:AngularFireStorage, private fb:FormBuilder, private cambiosService:CambiosService) {
    this.obrasForm = fb.group({
      nombre:['', Validators.required],
      descripcion:['', Validators.required],
      presupuesto:['', Validators.required],
      ubicacion:['', Validators.required],
      imagen:['', Validators.required]
    })
  }

  ngOnInit(): void {

    this.auth.user.subscribe((user) => {
      if (user) {
        this.logueado = true;
        this.email = user.email;
      } else {
        this.logueado = false;
      }
    })

    this.cambiosService.obtenerObras().subscribe((resp) => {
      this.obras = resp
    })

  }

  async guardarObra(){

    if (!this.obrasForm.invalid) {
      if (this.editar) {
        if (!this.file) {
          this.cambiosService.updateGebaeude(this.obraSeleccionada!.id, this.obrasForm.value).then(resp => {
            this.editar = false;
            alert('Cambios guardados.');
            this.obrasForm.reset();
          })
        }
        else {
          this.cambiosService.subirImagen(this.file!, this.obrasForm.value, this.obraSeleccionada!.id)
          this.obraSeleccionada = undefined;
          this.file = undefined;
        }
      }
      else {
        //Agregar Obra
        //llevar los datos a la base de datos, o sea, a Firestore
        this.cambiosService.subirImagen(this.file!, this.obrasForm.value);
          alert('Se ha agregado una obra.');
          this.obrasForm.reset();
      }
    }
    else{
      alert('El formulario es inválido.')
    }
  }

  eliminarObra(idObra:string){
    let eliminar=confirm("¿Desea eliminar la obra?")
    if(eliminar){
      this.cambiosService.deleteObra(idObra).then(resp => alert('Se ha eliminado una obra.'));
    }
  }

  selectObra(obra:Obra) {
    this.editar = true;
    this.obraSeleccionada = obra;
    const { nombre, descripcion, presupuesto, ubicacion, imagen } = obra;
    this.obrasForm.setValue({ nombre, descripcion, presupuesto, ubicacion, imagen })
  }

  vaciarFormulario(){
    this.obrasForm.reset();
  }

  obtenerFile(event:any){
    this.file = (event.target.files[0]);
  }

  actualizarObra(){
    if (this.editar){
      this.cambiosService.updateGebaeude(this.obraSeleccionada!.id, this.obrasForm.value).then((resp) => {
        this.editar = false;
        alert('Se han guardado los cambios.');
        this.obrasForm.reset();
      })
    }
  }

  // addObras(){
  //   if (this.obraSeleccionada){
  //    this.cambiosService.updateGebaeude(this.obraSeleccionada.id, this.obrasForm.value)
  //    .then((resp) => {
  //     alert('Se ha actualizado la obra con éxito.');
  //     this.obraSeleccionada = undefined;
  //    })
  //   } else {
  //     this.cambiosService.createObra(this.obrasForm.value)
  //    .then(resp => {
  //      this.vaciarFormulario();
  //     //  alert('Se ha agregado una obra.');
  //    })
  //     .catch((error) => {
  //       alert(error)
  //    })
  //   }
  // }

}
