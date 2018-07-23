import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // users: any[];
  // title = 'app';
  // db.list('/users')
  // itemRef: AngularFireObject<any>;
  // items: Observable<any[]>;
  constructor(private auth: AuthService, public db: AngularFireDatabase) {
	// this.itemRef = db.object('users');
	// this.itemRef.set({ '-LI1m3YSXibB4DMjBeq3': 'douche'})
	// this.itemRef.snapshotChanges().subscribe(action => {
	// 	console.log(action.type);
	// 	console.log(action.key);
	// 	console.log(action.payload.val());
	// 	console.log(action)
	// })
	// console.log(this.items)

  }
}