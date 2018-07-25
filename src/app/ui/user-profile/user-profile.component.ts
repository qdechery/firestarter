import { Component } from '@angular/core';

import { AuthService } from '../../core/auth.service';

import { AngularFirestoreCollection, AngularFirestore } from "angularfire2/firestore";

// import { switchMap, startWith, tap, filter } from 'rxjs/operators';
// import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  // locRef: AngularFirestoreCollection<Location>;
  user: string;

  constructor(public auth: AuthService, private afs: AngularFirestore) { 
 //    const size$ = new Subject<string>();
	// const queryObservable = size$.pipe(
	//   switchMap(size => 
	//     afs.collection('destinations', ref => ref.where('size', '==', size)).valueChanges()
	//   )
	// );
	// queryObservable.subscribe(queriedItems => {
 //  		console.log(queriedItems);  
	// });
  }

  logout() {
    this.auth.signOut();
  }
}
