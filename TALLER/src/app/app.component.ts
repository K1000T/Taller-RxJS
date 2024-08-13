import { Component } from '@angular/core';
import { User } from './models/User';
import { Post } from './models/Post';
import { HttpClient } from '@angular/common/http';
import { Observable, concatMap, mergeMap, of } from 'rxjs';
import { forkJoin } from 'rxjs';

import { Comment } from './models/Comment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  ROOT_URL = 'https://dummyjson.com';
  title = 'rxjs-example';
  usuario: User | null = null;
  comentarios: Comment[][] = [];
  mensajeError: string = '';
  publicacion: Post | null = null;
  txtUser: string = '';
  constructor(private http: HttpClient) { }
  user$: Observable<any> = new Observable();
  searchUser() {
    if(this.getUserAndPost() == null){
      this.mensajeError = "User not found"
      this.usuario = null
      this.publicacion = null

    }
  }


  getUserAndPost() {
    this.http
      .get<User>(this.ROOT_URL + '/users/filter?key=username&value=' + this.txtUser)
      .pipe(
        mergeMap((userInfo: any) => {
          if (!userInfo || userInfo.length === 0) {
            this.mensajeError = 'Ususario no encontrado';
            this.usuario = null;
            return of(null);
          } else {
            const firstUser = userInfo.users[0];
            const user: User = {
              id: firstUser.id,
              name: firstUser.firstName + ' ' + firstUser.lastName,
              username: firstUser.username,
              image: firstUser.image,
              email: firstUser.email,
              height: firstUser.height,
              weight: firstUser.weight,
              phone: firstUser.phone,
              gender: firstUser.gender,
            };
            this.usuario = user;
            this.mensajeError = '';
            return this.http.get<Post>(this.ROOT_URL + '/posts/user/' + userInfo.users[0].id);
          }
        }),
        concatMap((postInfo: any) => {
          if (!postInfo || postInfo.length === 0) {
            this.mensajeError = 'Comments not found';
            return of(null);
          } else {

            this.publicacion = postInfo.posts;
            this.mensajeError = '';
            const commentRequests = postInfo.posts.map((post: any) => {
              return this.http.get<Comment[]>(this.ROOT_URL + '/comments/post/' + post.id);
            });
            return forkJoin (commentRequests);
          }
        })
        
      )
      .subscribe(
        (info: any) => {
          const allComments = info.map((data: any) => data.comments);
          this.comentarios = allComments;
        },
        error => {
          console.error('Error al obtener datos:', error);
        }
      );      
      
  }

}