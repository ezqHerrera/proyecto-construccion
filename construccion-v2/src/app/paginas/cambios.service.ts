import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Obra } from './obra.interface';

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

  private urlImagen : string = '';
  subirImagen(file:File, obra:Obra, idObra?:string){
  //Ruta a la imagen
  const imagenPath = `/imagenes/${file.name}`;
  //Referencia a la imagen
  const imageRef = this.storage.ref(imagenPath);
  //Subimos la imagen a Storage
  const tarea = this.storage.upload(imagenPath, file);

  //Obtener la referencia a la imagen, o sea, a la url
  tarea.snapshotChanges().pipe(
    finalize(() => {
      imageRef.getDownloadURL().subscribe((imagen => {
        this.urlImagen = imagen;

        //Agrego la url de la imagen a la obra
        obra.imagen = this.urlImagen;
        //Así sé si quiero editar o agregar una obra, ya que si viene un id es porque quiero editarla
        if (idObra) {
          this.updateGebaeude(idObra, obra);
        }
        else {
          this.createObra(obra);
        }
      }))
    })).subscribe();
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

  //Actualiza una obra (Gebäude = Edificio)
  public updateGebaeude(ediId:string, data:Obra){
    return new Promise(async (resolve, rejects) => {
      try{
        const result = await this.firestore.collection('obras').doc(ediId).update(data)
        resolve(result)
      } catch(error){
        rejects(error)
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

}
