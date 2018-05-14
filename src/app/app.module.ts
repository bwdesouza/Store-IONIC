import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { MeusLivrosPage } from '../pages/meus-livros/meus-livros';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { LoginPage } from '../pages/login/login';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { AuthServiceProvider } from '../providers/auth-service.ts/auth-service';
import { OptionsPage } from '../pages/options/options';
import { ObservableService } from '../providers/data-service/observable-service';
import { DetalhesLivroPage } from '../pages/detalhes-livro/detalhes-livro';
import { DatePipe } from '@angular/common';
import { BookPage } from '../pages/book/book';
import { TocPage } from '../pages/toc/toc';
import { SettingsPage } from '../pages/settings/settings';
import { BookPageModule } from '../pages/book/book.module';
import { DetalhesLivroPageModule } from '../pages/detalhes-livro/detalhes-livro.module';
import { LoginPageModule } from '../pages/login/login.module';
import { OptionsPageModule } from '../pages/options/options.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { TocPageModule } from '../pages/toc/toc.module';

@NgModule({
  declarations: [
    MyApp,
    MeusLivrosPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    BookPageModule,
    DetalhesLivroPageModule,
    OptionsPageModule,
    LoginPageModule,
    SettingsPageModule,
    TocPageModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MeusLivrosPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataServiceProvider,
    AuthServiceProvider,
    ObservableService,
    DatePipe
  ]
})
export class AppModule {}
