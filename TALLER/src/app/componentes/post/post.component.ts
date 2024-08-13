import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  @Input() publicacion: any; 
  @Input() comentarios: any[] | undefined; 


  constructor() { }

  countPublicaciones(): number {
    return this.publicacion ? this.publicacion.length : 0;
  }

  countComentariosPorPublicacion(index: number): number {
    if (this.comentarios && this.comentarios[index]) {
      return this.comentarios[index].length;
    }
    return 0; 
  }
  
  
}