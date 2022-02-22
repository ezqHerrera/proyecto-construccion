import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Obra } from '../models/obra';

@Injectable({
  providedIn: 'root'
})
export class CambiosService {
  storage: any;

  public obras!: Observable<Obra[]>;
  private collectionObra!: AngularFirestoreCollection<Obra>;

  constructor (private firestore:AngularFirestore) {
    this.collectionObra = firestore.collection<Obra>('obras');
    console.log(this.collectionObra);
    this.obtenerObras();
  }

  private urlImagen : string = '';
  subirImagen(file:File){
    const imagenPath = `src/assets/${file.name}`;
    const imageRef = this.storage.ref(imagenPath);
    const tarea = this.storage.upload(imagenPath, file);

    tarea.snapshotChanges().pipe(
      finalize(() => {
        imageRef.getDownloadURL().subscribe((url:any) => {
          this.urlImagen = url;
        })
      })
    ).subscribe();
  }

  //Obtiene una obra
  obtenerObras(){
    return this.obras = this.collectionObra!.snapshotChanges().pipe(
      map(action => action.map(a => a.payload.doc.data() as Obra))
    )
  }

  //Obtiene una obra con su identificador
  public getObraById(data:Obra){
    return this.firestore.collection('obras').doc(data.id).snapshotChanges()
  }

  /**
   * Recibimos una obra y lo enviamos a la base de datos.
   * @param edif
   * @returns Promesa
   */
  public createObra(edif:Obra): Promise<void> {
    return new Promise(async(resolve, reject) => {
      try{
        const id = this.firestore.createId();
        edif.id = id;
        const result = await this.collectionObra?.doc(id).set(edif);
        resolve(result);
        alert('Se ha agregado una obra.')
      } catch (err) {
        reject (err)
      }
    })
  }

  //Elimina una obra
  public deleteObra(idObra: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.collectionObra?.doc(idObra).delete();
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

  //Actualiza una obra (Gebäude = Edificio)
  public updateGebaeude(ediId:string, data:Obra){
    return new Promise(async (resolve, rejects) => {
      try{
        const result = await this.firestore.collection('obras').doc(ediId).update(data);
        resolve(result)
      } catch(error){
        rejects(error)
      }
    })
  }


  /**
  public cursos!:Observable<Curso[]>;
  private collectionCurso!:AngularFirestoreCollection<Curso>;
  constructor(private firestore:AngularFirestore) {
    this.collectionCurso = firestore.collection<Curso>('cursos');
    this.obtenerCursos();
  }

  obtenerCursos(){
    return this.cursos = this.collectionCurso.snapshotChanges().pipe(map(
      action => action.map(a => a.payload.doc.data() as Curso)
      )
    )
  }

  //Obtiene un curso
  public getCursoById(data:Curso){
    return this.firestore.collection('cursos').doc(data.id).snapshotChanges();
  }

  //Actualiza un curso
  public updateCurso(data:Curso, id:string){
    this.firestore.collection('cursos').doc(id).update(data);
    console.log(data)
  }

  //Elimina un curso
  public deleteCurso(data:Curso):Promise<void>{
    return new Promise(async(resolve, reject) => {
      try{
        const result = await this.collectionCurso?.doc(data.id).delete();
        resolve (result)
        alert('Curso eliminado.')
      } catch (error) {
        reject(error)
      }
    })
  }

  //Crea un nuevo curso
  public createCurso(data:Curso):Promise<void>{
    return new Promise(async(resolve, reject) => {
      try{
        const id = this.firestore.createId();
        data.id = id;
        const result = await this.collectionCurso?.doc(id).set(data);
        resolve(result);
        alert('Se ha agregado un curso.')
      } catch (err) {
        reject (err)
      }
    })
  } */
}
