import { Component } from '@angular/core';
import { NavController, Platform, AlertController, App, ToastController, Loading, LoadingController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { File } from '@ionic-native/file';
import { BookPage } from '../book/book';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { UsuarioLivroCommand } from '../../commands/usuario-livro-command';

declare var cordova: any;

@Component({
  selector: 'page-meus-livros',
  templateUrl: 'meus-livros.html',
  providers: [File, ConfigProvider]
})
export class MeusLivrosPage {

  loading: Loading;
  livrosBaixados = new Array<any>();
  livroLerAgora = new Array<any>();
  gridVazia = true;
  storageDirectory: string = '';
  telaPequena: boolean = false;
  User: any;

  constructor(public navCtrl: NavController,
    private file: File,
    private app: App,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private configProvider: ConfigProvider,
    private platform: Platform,
    private dataService: DataServiceProvider,
    private alertCtrl: AlertController, ) {

  }

  ionViewDidEnter() {
    this.showLoading();
    this.telaPequena = window.innerWidth < 400 ? true : false;
    this.getLivros();
  }

  getLivros() {

    this.User = JSON.parse(this.configProvider.getUser());

    this.platform.ready().then(() => {

      // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
      if (!this.platform.is('cordova')) {
        this.livrosBaixados = new Array<any>();
        return false;
      }

      if (this.platform.is('ios')) {
        this.storageDirectory = cordova.file.dataDirectory;
      }
      else if (this.platform.is('android')) {
        this.storageDirectory = cordova.file.dataDirectory;
      }
      else {
        this.livrosBaixados = new Array<any>();
        this.showAlert('erro');
        // exit otherwise, but you could add further types here e.g. Windows
        return false;
      }

      this.file.listDir(this.storageDirectory, this.User.username).then((values) => {

        this.livrosBaixados = this.configProvider.getLocalBookShow(values);

        if (this.livrosBaixados && this.livrosBaixados.length > 0) {
          this.livroLerAgora = this.livrosBaixados;
          this.gridVazia = false;
        } else {
          this.livroLerAgora = null;
        }

      }).catch((error) => {
        this.showAlert('Ocorreu um erro ao buscar seus livros!');
        this.loading.dismiss();
      });

    }).catch((error) => {
      this.showAlert('erro ao ler a plataforma!');
      this.loading.dismiss();
    });

    this.loading.dismiss();
  }

  atualizarTela(event) {
    this.showLoading();

    this.file.listDir(this.storageDirectory, this.User.username).then((values) => {

      this.livrosBaixados = this.configProvider.getLocalBookShow(values);

      if (this.livrosBaixados && this.livrosBaixados.length > 0) {
        this.livroLerAgora = this.livrosBaixados;
        this.gridVazia = false;
      } else {
        this.livroLerAgora = null;
      }

      event.complete();
      this.loading.dismiss();
    }).catch((error) => {
      this.showAlert('Ocorreu um erro ao buscar seus livros!');
      this.loading.dismiss();
      event.complete();
    });

  }

  apagarLivro(book) {
    this.file.removeFile(this.storageDirectory + this.User.username, book.nome + '.epub').then((resp) => {

      let usuarioLivro = new UsuarioLivroCommand(book.codigo, this.User.username);
      this.removeLivroParaUsuario(usuarioLivro);

      this.configProvider.cleanSpecificBook(book.codigo);

      let index = this.livroLerAgora.findIndex(p => p.nome == book.nome);
      this.livroLerAgora.splice(index, 1);

      if (this.livroLerAgora.length <= 0)
        this.gridVazia = true;

      let toast = this.toastCtrl.create({
        message: 'O Livro foi excluído com sucesso!',
        duration: 2500,
        position: 'top'
      });
      toast.present();

    }).catch((erro) => {
      let toast = this.toastCtrl.create({
        message: 'Ocorreu um erro ao excluir o livro.',
        duration: 2500,
        position: 'top'
      });
      toast.present();
    })
  }

  removeLivroParaUsuario(usuarioLivro: UsuarioLivroCommand) {
    this.dataService.removeLivroUsuario(usuarioLivro)
      .subscribe(data => {
        console.log(JSON.stringify(data));
      }, erro => {
        console.log(JSON.stringify(erro));
      });
  }

  showLivro(book) {
    let obj = { book: book, online: false };
    this.app.getRootNav().push(BookPage, obj);
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Alerta',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  showConfirm(book) {
    let confirm = this.alertCtrl.create({
      title: book.nome,
      message: 'Tem certeza que deseja excluir este livro do seu dispositivo ?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            let toast = this.toastCtrl.create({
              message: 'A exclusão do livro foi cancelada.',
              duration: 2000,
              position: 'top'
            });
            toast.present();
          }
        },
        {
          text: 'Excluir',
          handler: () => {
            this.apagarLivro(book);
          }
        }
      ]
    });

    confirm.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando Livro(s)...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }


}
