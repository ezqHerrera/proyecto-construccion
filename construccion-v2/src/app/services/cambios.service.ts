import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CambiosService {
  storage: any;

  private urlImagen : string = '';
  constructor() { }

  subirImagen(file:File){
    const imagenPath = `src/assets/${file.name}`;
    const imageRef = this.storage.ref(imagenPath);
    const tarea = this.storage.upload(imagenPath, file);

    tarea.snapshotChanges().pipe(
      finalize(()=>{
        imageRef.getDownloadURL().subscribe((url:any)=>{
          this.urlImagen = url;
        })
      })
    ).subscribe();
  }
}
