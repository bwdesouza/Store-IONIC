import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { Loading } from 'ionic-angular/components/loading/loading';
import { LoginCommand } from '../../commands/login-command';
import { TabsPage } from '../tabs/tabs';
import { AuthServiceProvider } from '../../providers/auth-service.ts/auth-service';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [
    Device
  ]
})
export class LoginPage {
  loading: Loading;
  registerCred: LoginCommand = new LoginCommand('','');

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private auth: AuthServiceProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public dataService: DataServiceProvider,
    private device: Device) {
  }

  ionViewDidLoad() {

  }

  
  public login() {
    this.showLoading();

    this.dataService.login(this.registerCred).subscribe(data => {
      if (data.token != '') {
        this.auth.login(data.user).subscribe(allowed => {
          if (allowed) {
              this.navCtrl.setRoot(TabsPage);
          } else {
            this.showError("Acesso negado!");
          }
        },
          error => {
            this.showError(error);
          });
      } else {
        this.showError(data.erro);
      }
    }, error => {
      if (error.status == 401) {
        this.showError("Usuário ou Senha inválido!");
      }
    });

  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Aguarde...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Erro',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Alerta',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
