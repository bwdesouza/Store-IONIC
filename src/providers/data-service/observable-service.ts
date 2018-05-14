import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoginCommand } from '../../commands/login-command';
import { Observable, Observer } from 'rxjs/Rx';

@Injectable()
export class ObservableService {
    mudarGridChange : Observable<any>;
    mudarGridObserver : Observer<any>;    
    
  constructor() {
    this.mudarGridChange = new Observable((observer: Observer<any>) => {
        this.mudarGridObserver = observer;
      });  
  }

  Notify(value){
    this.mudarGridObserver.next(value);
  }
}
