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
  subirImagen(file:File, obra:Obra, idObra?:string){
  //Ruta a la imagen
  const imagenPath = `imagenes/${file.name}`;
  //Referencia a la imagen
  const imageRef = this.storage.ref(imagenPath);
  //Subimos la imagen a Storage
  const tarea = this.storage.upload(imagenPath, file);

  //Obtener la referencia a la imagen, o sea, a la url
  tarea.snapshotChanges().pipe(
    finalize(() => {//si imagen(url) no está definido como string, genera un error por estar implícitamente definido como 'any'
      imageRef.getDownloadURL().subscribe(((imagen:string) => {
        this.urlImagen = imagen;

        //Agrego la url de la imagen a la obra
        obra.imagen = this.urlImagen;
        if (idObra) {
          this.updateGebaeude(idObra, obra);
        }
        else {
          this.createObra(obra);
        }
      }))
    })).subscribe();
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
}
