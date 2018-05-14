import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Loading, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { ConfigProvider } from '../../providers/config/config';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { File } from '@ionic-native/file';
import { BookPage } from '../book/book';
import { UsuarioLivroCommand } from '../../commands/usuario-livro-command';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-detalhes-livro',
  templateUrl: 'detalhes-livro.html',
  providers: [File]
})
export class DetalhesLivroPage {

  livro: any;
  tenhoEsteLivro: boolean = false;
  telaPequena: boolean = false;
  storageDirectory: string = '';
  loading: Loading;
  User: any;
  livrosBaixados: any;

  constructor(public navCtrl: NavController,
    public dataService: DataServiceProvider,
    public navParams: NavParams,
    public platform: Platform,
    private file: File,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private configProvider: ConfigProvider,
    private toastCtrl: ToastController,
    public datepipe: DatePipe) {
    this.livro = this.navParams.get('livro');
    this.livro.dtaCadastro = this.datepipe.transform(this.livro.dtaCadastro, 'dd/MM/yyyy');
    this.livro.precoDigital = this.livro.precoDigital.toString().replace('.', ',');


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
  }

  ionViewDidLoad() {
    this.telaPequena = window.innerWidth < 400 ? true : false;
      
    this.file.listDir(this.storageDirectory, this.User.username).then((values) => {

      this.livrosBaixados = this.configProvider.getLocalBookShow(values);

      if (this.livrosBaixados && this.livrosBaixados.length > 0) {
        this.livrosBaixados.forEach(livro => {
          if (livro.nome == this.livro.titulo) {
            this.tenhoEsteLivro = true;
          } else {
            this.tenhoEsteLivro = false;
          }
        });
      } else {
        this.tenhoEsteLivro = false;
      }

    });
  }

  downloadLivro(livro) {

    this.showLoading();
    let codigo = livro.id;

    this.dataService.getLivro(this.User.username, codigo)
      .subscribe(data => {
        //Cria um diretório
        data.livro = data.data;

        var binary_string = atob(data.livro);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        
        this.file.checkDir(this.storageDirectory, this.User.username).then((existeDir) =>
        {
            this.criarLivro(livro, bytes, this.User.username, codigo);
        }).catch((error) => 
        {
          this.file.createDir(this.storageDirectory, this.User.username, true).then((obj) => 
          {
            this.criarLivro(livro, bytes, this.User.username, codigo);
          }).catch(err => 
          {
              this.loading.dismiss();
              this.showAlert("Erro ao criar um diretório: " + JSON.stringify(err))
          });
        });

      }, erro => {
        this.loading.dismiss();
        this.showAlert('Ocorreu um erro ao fazer o download, por favor tente novamente ou contate a equipe tecnica!');
      });
  }

  criarLivro(data, bytes, username, codigo) {
    //criar um arquivo            
    this.file.writeFile(this.storageDirectory + '/' + username, data.titulo + '.epub', bytes.buffer, {replace: true}).then((arquivo) => {
      let toast = this.toastCtrl.create({
        message: 'Livro baixado com sucesso!',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.tenhoEsteLivro = true;
      this.loading.dismiss();

      //salva o livro em LocalStorage
      this.configProvider.setLocalBook(codigo, data.titulo, Date.now, '', data.capaString, data.autoria, arquivo.fullPath, arquivo.nativeURL);

      let usuarioLivro = new UsuarioLivroCommand(codigo, this.User.username);      
      this.gravarLivroParaUsuario(usuarioLivro);

    }).catch(err => {
      this.loading.dismiss();
      this.showAlert("Erro ao escrever um arquivo: " + JSON.stringify(err));
    });
  }

  gravarLivroParaUsuario(usuarioLivro: UsuarioLivroCommand){
      this.dataService.setLivroUsuario(usuarioLivro)
      .subscribe(data => {
        console.log(JSON.stringify(data));
      }, erro => {
        console.log(JSON.stringify(erro));
      });
  }

  showLivro(livro, online) {
    this.navCtrl.push(BookPage, {
      book: livro,
      online: online
    });
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Alerta',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Baixando livro...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
