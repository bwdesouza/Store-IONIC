import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class User {
  username: string;
  email: string;
 
  constructor(username: string, email:string) {
    this.username = username;
    this.email = email;
  }
}

export class Device {
  nome: string;
  modelo: string;
  deviceid: string;
  token: string;
  datacadastro: string;
 
  constructor(nome: string, modelo:string, deviceid:string, token:string, datacadastro:string) {
    this.nome = nome;
    this.modelo = modelo;
    this.deviceid = deviceid;
    this.token = token;
    this.datacadastro = datacadastro;
  }
}

@Injectable()
export class AuthServiceProvider {
  currentUser: User;
  devices = new Array<Device>();

  constructor(public http: Http) {

  }

  public login(credentials) {
    if (credentials.username === null) {
      return false;
    } else {
      return Observable.create(observer => {
        //Salva os Dados
        this.currentUser = new User(credentials.username, credentials.email);
        // this.devices = devices;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        // localStorage.setItem('userListDevices', JSON.stringify(this.devices));
        // localStorage.setItem('userLocalDevice', JSON.stringify(localDevice));
        
        //Seta o Login
        let access = (true);
        observer.next(access);
        observer.complete();
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }
 
  public logout() {
    localStorage.setItem('userData', '');
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
