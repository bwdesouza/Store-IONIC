import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ObservableService } from '../../providers/data-service/observable-service';

/**
 * Generated class for the OptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-options',
  templateUrl: 'options.html'
})
export class OptionsPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private observableService: ObservableService) {
  }

  ionViewDidLoad() {
  }

  mudaParaGrid(value){
    this.observableService.Notify(value);
  }

}
