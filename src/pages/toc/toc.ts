import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-toc',
  templateUrl: 'toc.html',
})
export class TocPage {
  private toc: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public events : Events) {
    this.toc = navParams.data.toc;
  }

  selectToc(content){
    console.log(content)
    this.events.publish('select:toc', content);
    this.navCtrl.pop();
  }
}
