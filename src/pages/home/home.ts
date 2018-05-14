import { Component } from '@angular/core';
import { NavController, NavParams, App, Platform, AlertController, LoadingController, Loading, PopoverController, ToastController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { OptionsPage } from '../options/options';
import { ObservableService } from '../../providers/data-service/observable-service';
import { DetalhesLivroPage } from '../detalhes-livro/detalhes-livro';
import { File } from '@ionic-native/file';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [DataServiceProvider, ConfigProvider, File]
})

export class HomePage {

  loading: Loading;
  synchronize: Loading;
  lstAtual = new Array<any>();
  lstLivros = new Array<any>();
  lstLivrosBkp = new Array<any>();
  lstLivrosGrid = new Array<any>();
  lstLivrosGridBkp = new Array<any>();
  livrosBaixados = new Array<any>();
  exibicaoGridLst$: any = true;
  falta1Img: boolean = false;
  falta2Img: boolean = false;
  ultimoLivro: number = 0;
  User: any;
  storageDirectory: string = '';
  lstIdsLivros = new Array<any>();
  ultimoIdLivro = false;
  lstAux = new Array<any>();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    private file: File,
    private platform: Platform,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private configProvider: ConfigProvider,
    private loadingCtrl: LoadingController,
    private dataService: DataServiceProvider,
    private observableService: ObservableService,
    public popoverCtrl: PopoverController) {

    this.platform.ready().then(() => {
      this.User = JSON.parse(this.configProvider.getUser());
      // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
      if (!this.platform.is('cordova')) {
        return false;
      }

      if (this.platform.is('ios')) {
        this.storageDirectory = cordova.file.dataDirectory;
      }
      else if (this.platform.is('android')) {
        this.storageDirectory = cordova.file.dataDirectory;
      }
      else {
        // exit otherwise, but you could add further types here e.g. Windows
        return false;
      }
    });

    this.showLoading();

    this.getAll();
  }

  ngOnInit() {
    this.observableService.mudarGridChange.subscribe(exibir => {
      this.exibicaoGridLst$ = exibir;
    });
  }

  sincronizarConta() {

    this.dataService.getLivrosUsuarioLogado(this.User.username).subscribe(
      data => {
        this.showSynchronize();

        this.lstIdsLivros = data.data;
        let idExiste = false;
        let cont = 0;
        if (this.lstIdsLivros != null && this.lstIdsLivros != undefined && this.lstIdsLivros.length > 0) {
          console.log("=============== Vai procurar os livros ===================");
          this.file.listDir(this.storageDirectory, this.User.username).then((values) => {
            
          console.log("=============== encontrou os livros ===================");
          console.log("=============== " + JSON.stringify(values) + " ===================");

            this.livrosBaixados = this.configProvider.getLocalBookShow(values);

            console.log("=============== vai tentar baixar ===================");
            if (this.livrosBaixados && this.livrosBaixados.length > 0) {
              this.lstIdsLivros.forEach(idLivro => {
                if (this.livrosBaixados.length > 0) {
                  this.livrosBaixados.forEach(livrosBaixados => {
                    if (livrosBaixados.codigo == idLivro)
                      idExiste = true;
                  });
                }
                if (idExiste == false) {
                  this.lstAux.push(idLivro);
                }
                else {
                  cont++;
                  idExiste = false;
                }
              });

              setTimeout(() => {
                if (this.lstAux.length > 0) {
                  this.lstAux.forEach(id => {
                    this.downloadLivro(id);
                  });
                }
              }, 2000);


              if (this.lstIdsLivros.length == cont) {
                let toast = this.toastCtrl.create({
                  message: 'Seu dispositivo já está atualizado!',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();

                this.synchronize.dismiss();
              }
            } else {
              this.lstAux = this.lstIdsLivros;
              this.lstIdsLivros.forEach(id => {
                this.downloadLivro(id);
              });
            }

          }).catch((error) => {
            console.log("=============== vai tentar fazer o download ===================");
            this.lstAux = this.lstIdsLivros;
            this.lstIdsLivros.forEach(id => {
              this.downloadLivro(id);
            });
          });
        }
        else {
          let toast = this.toastCtrl.create({
            message: 'Seu dispositivo já está atualizado!',
            duration: 3000,
            position: 'top'
          });
          toast.present();

          this.synchronize.dismiss();
        }

      }, error => {
        this.showErrorSyncroniza();
        this.synchronize.dismiss();
      }
    );
  }

  getAll() {

    this.dataService.getAllLivros().subscribe(
      data => {
        const response = (data as any);
        let lst = JSON.parse(response._body).data;
        this.lstAtual = lst;

        if (lst.length > 0) {
        this.lstLivrosGrid = this.carregaListaParaGrid(lst);
        this.lstLivrosGridBkp = this.lstLivrosGrid;
        this.lstLivros.push(this.carregaListaPorCategoria(lst));
        this.lstLivrosBkp = this.lstLivros;
        }

        this.loading.dismiss();

        setTimeout(() => {
          this.sincronizarConta();
        }, 2000);

      }, error => {
        this.lstLivros = new Array<any>();
        this.lstLivrosBkp = this.lstLivros;
        this.lstLivrosGrid = new Array<any>();
        this.lstLivrosGridBkp = this.lstLivrosGrid;
      }
    );
  }

  atualizarTela(event) {

    this.dataService.getAllLivros().subscribe(
      data => {
        this.lstLivros = new Array<any>();
        this.lstLivrosBkp = this.lstLivros;
        this.lstLivrosGrid = new Array<any>();
        this.lstLivrosGridBkp = this.lstLivrosGrid;

        const response = (data as any);
        let lst = JSON.parse(response._body).data;
        this.lstAtual = lst;

        if (lst.length > 0) {
          this.lstLivrosGrid = this.carregaListaParaGrid(lst);
          this.lstLivrosGridBkp = this.lstLivrosGrid;
          this.lstLivros.push(this.carregaListaPorCategoria(lst));
          this.lstLivrosBkp = this.lstLivros;
        }

        event.complete();
      }, error => {
        event.complete();
        this.lstLivros = new Array<any>();
        this.lstLivrosBkp = this.lstLivros;
        this.lstLivrosGrid = new Array<any>();
        this.lstLivrosGridBkp = this.lstLivrosGrid;
      }
    );
  }

  carregaListaPorCategoria(lst: any): any {
    let catAux = lst[0].categoria.descricao;
    let arrayLst = new Array<any>();
    lst.forEach(lt => {
      if (catAux == lt.categoria.descricao) {
        arrayLst.push(lt);
      }
      else {
        this.lstLivros.push(arrayLst);
        arrayLst = new Array<any>();
        arrayLst.push(lt);
        catAux = lt.categoria.descricao;
      }
    });

    return arrayLst;
  }

  carregaListaParaGrid(lst: any): any {
    let cont = 0;
    this.falta1Img = false;
    this.falta2Img = false;
    let result = new Array<any>();
    let arrayGrd = new Array<any>();
    lst.forEach(livros => {
      if (cont <= 2) {
        arrayGrd.push(livros);
        cont++;
      }
      else {
        cont = 1;
        result.push(arrayGrd);
        arrayGrd = new Array<any>();
        arrayGrd.push(livros);
      }
    });
    result.push(arrayGrd);

    let aux = result.length - 1;
    let aux2 = result[aux].length - 1;
    this.ultimoLivro = result[aux][aux2].id;
    if (result[aux].length < 3) {
      if (result[aux].length == 1) {
        this.falta1Img = true;
        this.falta2Img = true;
      }
      else if (result[aux].length == 2) {
        this.falta1Img = true;
      }
    }

    return result;
  }

  pesquisaLivro(value: any) {
    if (value == '') {
      this.lstLivros = this.lstLivrosBkp;
      this.lstLivrosGrid = this.lstLivrosGridBkp;
      return;
    }

    this.lstLivros = this.lstLivrosBkp;
    this.lstLivrosGrid = this.lstLivrosGridBkp;
    let listaFiltrada = [];
    this.lstAtual.forEach(liv => {
      if (liv.titulo.toUpperCase().indexOf(value.toUpperCase()) != -1 || liv.autoria.toUpperCase().indexOf(value.toUpperCase()) != -1) {
        listaFiltrada.push(liv);
      }
    });

    this.lstLivros = new Array<any>();
    this.lstLivrosGrid = new Array<any>();
    this.lstLivrosGrid = this.carregaListaParaGrid(listaFiltrada);
    this.lstLivros.push(this.carregaListaPorCategoria(listaFiltrada));
  }

  downloadLivro(codigo) {
    let livro = this.lstAtual.find(p => p.id == codigo);

    console.log("=============== entrou no download ===================" + this.User.username + "||" + codigo); 
    this.dataService.getLivro(this.User.username, codigo)
      .subscribe(data => {
        //Cria um diretório
    console.log("=============== achou o livro============ "); 
        data.livro = data.data;

        var binary_string = atob(data.livro);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        // //verifica se o arquivo existe
        this.file.checkDir(this.storageDirectory, this.User.username).then((existeDir) => {
          this.criarLivro(livro, bytes, this.User.username, codigo);
        }).catch((error) => {
          this.file.createDir(this.storageDirectory, this.User.username, true).then((obj) => {
            this.criarLivro(livro, bytes, this.User.username, codigo);
          }).catch(err => {
            this.showErrorSyncroniza();
            this.synchronize.dismiss();
          });
        });
      }, erro => {
        console.log("=============== ERRO AO ACHAR O LIVRO ============ " + JSON.stringify(erro)); 
        this.showErrorSyncroniza();
        this.synchronize.dismiss();
      });
  }

  criarLivro(data, bytes, username, codigo) {
    //criar um arquivo            

    console.log("=============== Vai escrever o livro ===================");
    this.file.writeFile(this.storageDirectory + '/' + username, data.titulo + '.epub', bytes.buffer, { replace: true }).then((arquivo) => {

      let id = this.lstAux[this.lstAux.length - 1];
      if (id == codigo) {
        let toast = this.toastCtrl.create({
          message: 'Conta sincronizada com sucesso!',
          duration: 2500,
          position: 'top'
        });
        toast.present();

        this.synchronize.dismiss();
      }


      console.log("=============== ESCREVEU ===================");
      //salva o livro em LocalStorage
      this.configProvider.setLocalBook(codigo, data.titulo, Date.now, '', data.capaString, data.autoria, arquivo.fullPath, arquivo.nativeURL);

    }).catch(err => {
      console.log("=============== Erro ao escrever o livro ===================");
      console.log("============= ERRO >>>" +JSON.stringify(err));
      this.showErrorSyncroniza();
      this.synchronize.dismiss();
    });
  }

  presentPopover(ev) {
    let popover = this.popoverCtrl.create(OptionsPage, {
    });
    popover.present({ ev });
  }

  detalhesLivro(livro) {
    let obj = { livro: livro };
    this.app.getRootNav().push(DetalhesLivroPage, obj);
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Alerta',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Erro',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }


  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showSynchronize() {
    this.synchronize = this.loadingCtrl.create({
      content: 'Sincronizando...',
      dismissOnPageChange: true
    });
    this.synchronize.present();
  }

  showErrorSyncroniza() {
    let toast = this.toastCtrl.create({
      message: 'Ocorreu um erro ao sincronizar sua conta.',
      duration: 2500,
      position: 'top'
    });
    toast.present();
  }
}
