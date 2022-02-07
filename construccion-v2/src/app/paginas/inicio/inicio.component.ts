import { Component, OnInit } from '@angular/core';
import { CambiosService } from '../../services/cambios.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(private cambiosService: CambiosService) { }

  ngOnInit(): void {
  }

  subirImagen(file:File){
    this.cambiosService.subirImagen(file);
  }

}
