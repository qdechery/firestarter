import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection  } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './../../core/auth.service';

export interface User {
  dislayName: string;
  email: string;
  photoURL: string;
}

export interface Location { 
  id: string;
  location: string; 
  user: string;
  timeAdded: string; 
}
// export interface LocationId extends Location { id: string; }

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  users$: Observable<User[]>;
  private destCollection: AngularFirestoreCollection<Location>;
  destinations: Observable<Location[]>;
  // locRef: AngularFirestoreCollection<Location>;

  
  constructor(afs: AngularFirestore, public auth: AuthService) {
    this.destCollection = afs.collection<Location>('destinations');
    this.destinations = this.destCollection.valueChanges();


    // this.destinations = this.destCollection.snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data() as Location;
    //     const id = a.payload.doc.id;
    //     console.log( id, ...data );
    //   }))
    // );
    // console.log(this.destinations$)
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
