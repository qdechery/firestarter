import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService, User } from '../core/auth.service';

@Injectable()
export class NotesService {

  noteAdd: number = 10;
  notesCollection: AngularFirestoreCollection<any>;
  noteDocument:   AngularFirestoreDocument<any>;
  user: any[] = [];

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.notesCollection = this.afs.collection('notes', (ref) => ref.orderBy('time', 'desc').limit(this.noteAdd));
    
    //Add user to note data so we can show who posted each note.
    this.auth.user.subscribe(user => {
      this.user = [user.displayName, user.uid];
    });
  }

  getData(): Observable<any[]> {
    // ['added', 'modified', 'removed']
    this.notesCollection = this.afs.collection('notes', (ref) => ref.orderBy('time', 'desc').limit(this.noteAdd));
    // console.log(this.noteAdd);
    return this.notesCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  

  }

  getNote(id: string) {
    return this.afs.doc<any>(`notes/${id}`);
  }

  loadMoreNotes(count: number){
    this.noteAdd += count;
  }

  createNote(content: string) {
    const note = {
      user: this.user,
      content,
      hearts: 0,
      time: new Date().getTime(),
    };
    return this.notesCollection.add(note);
  }

  updateNote(id: string, data: any) {
    return this.getNote(id).update(data);
  }

  deleteNote(id: string) {
    return this.getNote(id).delete();
  }
}
