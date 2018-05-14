export class UsuarioLivroCommand{
    idLivro: string;
    usuario: string;

    constructor(idLivro: string, usuario: string){
        this.idLivro = idLivro;
        this.usuario = usuario;
    }
}