import { Injectable } from '@angular/core';


@Injectable()
export class ConfigProvider {
  //Recupera os dados do LocalStorage
  getLocalDevice(): any {
    return localStorage.getItem('userLocalDevice');
  }

  getUser(): any {
    return localStorage.getItem('user');
  }

  getListDevice(): any {
    return localStorage.getItem('userListDevices');
  }

  getLocalBook(): any{
    return  localStorage.getItem('userListBooks');
  }
  
  getLocalBookShow(values): any{
    var user = JSON.parse(localStorage.getItem('user'));
    var currentList:Array<any> = new Array<any>();
    var livrosBaixados = new Array<any>();
 
    if(localStorage.getItem('userListBooks') != ''){
      currentList = JSON.parse(localStorage.getItem('userListBooks'));
      console.log('Livros Locais:' + JSON.stringify(currentList));
      //Busca os dados do livro
      if(values != undefined)
        if(values.length > 0)
        console.log('Values:' + JSON.stringify(values));
          for(let data of values) {
            var reg = currentList.filter(x => x.username == user.username)[0];
            console.log('REG ===== :' + JSON.stringify(reg));
            var livro  = reg.livro.filter(x => (x.nome == data.name || x.nome == data.name.split('.epub')[0]))[0];
            console.log('LIVROOO =====> :' + JSON.stringify(livro));
            if(livro != undefined && livro != 'undefined' && livro != null)
            {
              livro.file = data.name;
              livrosBaixados.push(livro);
            }
          }
    }
    
    console.log('LIVROS BAIXADOS ===> :' + JSON.stringify(livrosBaixados));
    return livrosBaixados;
  }

  //Limpar dados
  clearUserData(){
    localStorage.setItem('user', '');
    localStorage.setItem('userListDevices', '');
    localStorage.setItem('userLocalDevice', '');
  }

  cleanSpecificBook(codigo){
    var user = JSON.parse(localStorage.getItem('user'));
    var currentList:Array<any> = new Array<any>();
    currentList = JSON.parse(localStorage.getItem('userListBooks'));

    var reg = currentList.filter(x => x.username == user.username)[0];
    var livro  = reg.livro.filter(x => x.codigo == codigo)[0];
    reg.livro.splice(reg.livro.indexOf(livro), 1);

    //console.log('delete book: ' + JSON.stringify(currentList));
    localStorage.setItem('userListBooks', JSON.stringify(currentList));
  }


  //Seta os dados do LocalStorage
  setLocalDevice(device) {
    localStorage.setItem('userLocalDevice', JSON.stringify(device));
  }

  setListDevice(devices){
    localStorage.setItem('userListDevices', JSON.stringify(devices));
  }

  setLocalBook(codigo, nome, dt_download, dt_expiracao, capa, autorLivro, fullPath, nativeURL){
    var Book = {
      codigo: '',
      nome: '',
      dt_download: '',
      dt_expiracao: '',
      capa: '',
      autorLivro: '',
      fullPath: '',
      nativeURL: ''
    };
    var lstLocalBook = { 
      username: '', 
      livro: [] 
    };

    Book.codigo = codigo;
    Book.nome = nome;
    Book.dt_download = dt_download;
    Book.dt_expiracao = dt_expiracao;
    Book.capa = capa;
    Book.autorLivro = autorLivro;
    Book.fullPath = fullPath;
    Book.nativeURL = nativeURL;

    var user = JSON.parse(localStorage.getItem('user'));

    var currentList:Array<any> = new Array<any>();
    
    //Verifica se tem a storage salva
    if(localStorage.getItem('userListBooks') != '' && localStorage.getItem('userListBooks') != null)
    {
      currentList = JSON.parse(localStorage.getItem('userListBooks'));
      //Verifica se tem o Aluno
      if(currentList.filter(x => x.username == user.username)[0] != null){
        var reg = currentList.filter(x => x.username == user.username)[0];

        //Verifica se tem já o livro
        if(reg.livro.filter(x => x.codigo == codigo)[0] != null){
          //Exclui o livro que tem
          reg.livro.splice(reg.livro.indexOf(reg.livro.filter(x => x.codigo == codigo)[0]), 1);
          //Inclui novamente
          reg.livro.push(Book);
        }else{
          reg.livro.push(Book);
        }

        currentList.filter(x => x.username == user.username)[0] = reg;
      }else{
        //Cria o aluno e salva o livro
        lstLocalBook.username = user.username;
        lstLocalBook.livro.push(Book);
        currentList.push(lstLocalBook);
      }
    }else{
      //Cria a Storage, usuário e livro
      currentList = new Array<any>();

      lstLocalBook.username = user.username;
      lstLocalBook.livro.push(Book);
      currentList.push(lstLocalBook);
    }

    localStorage.setItem('userListBooks', JSON.stringify(currentList));
    //console.log('Resultado:' + JSON.stringify(localStorage.getItem('userListBooks')));
  }
}
