import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoginCommand } from '../../commands/login-command';
import { UsuarioLivroCommand } from '../../commands/usuario-livro-command';

@Injectable()
export class DataServiceProvider {
  private urlApi:string = 'http://localhost:55568';
  
  constructor(public http: Http) {
    
  }

  login(loginCommand: LoginCommand){
    let url = this.urlApi + '/api/authenticate';

    return this.http.post(url, loginCommand)
            .map((res: Response) => res.json());        
  }

  getAllLivros(){
    return this.http.get(this.urlApi + '/api/livro/allPublished');
  }

  getLivro(userName:string, codigoLivro:string){
    let url = this.urlApi + '/api/livro/livro/';
    return this.http.get(url + userName + '/' + codigoLivro)
    .map((res: Response) => res.json());
  }

  getLivrosUsuarioLogado(userName:string){
    let url = this.urlApi + '/api/livro/booksByUser/';
    return this.http.get(url + userName)
    .map((res: Response) => res.json());
  }

  setLivroUsuario(usuarioLivroCommand: UsuarioLivroCommand){
    let url = this.urlApi + '/api/livro/SetBookByUser';

    return this.http.post(url, usuarioLivroCommand)
            .map((res: Response) => res.json());        
  }

  removeLivroUsuario(usuarioLivroCommand: UsuarioLivroCommand){
    let url = this.urlApi + '/api/livro/RemoveBookByUser';

    return this.http.post(url, usuarioLivroCommand)
            .map((res: Response) => res.json());        
  }

}
