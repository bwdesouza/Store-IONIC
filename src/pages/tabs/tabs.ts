import { Component } from '@angular/core';

import { MeusLivrosPage } from '../meus-livros/meus-livros';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MeusLivrosPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
