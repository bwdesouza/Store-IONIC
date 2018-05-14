import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service.ts/auth-service';
import { LoginPage } from '../login/login';
import { ConfigProvider } from '../../providers/config/config';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController,
    private auth: AuthServiceProvider,
    private app: App,
    private config: ConfigProvider) {

  }
  
  public logout() {
    this.auth.logout().subscribe(succ => {
      this.config.clearUserData();
      this.app.getRootNav().setRoot(LoginPage, {}, { animate: true, direction: 'forward' });
    });
  }

}
