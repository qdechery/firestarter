import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection  } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';

import { AuthService } from './../../core/auth.service';

export interface User {
  dislayName: string;
  email: string;
  photoURL: string;
}

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  users$: Observable<User[]>;

  
  constructor(afs: AngularFirestore, public auth: AuthService) {
    // this.users$ = Observable.subscribe(user => 
    //   afs.collection<User>('users', ref => {
    //     // let query : firebase.firestore.Query = ref;
    //     // if (size) { query = query.where('size', '==', size) };
    //     // if (color) { query = query.where('color', '==', color) };
    //     // return query;
    //     console.log(this.auth.user);
    //   }).valueChanges()
    // );
  }
  // filterBySize(size: string|null) {
  //   this.sizeFilter$.next(size); 
  // }
  // filterByColor(color: string|null) {
  //   this.colorFilter$.next(color); 
  // }
  
  // firebase(){
  //   console.log(this.auth.user);
  //   console.log(this.user);
    
  // }
  
  ngOnInit(){
  }
}
