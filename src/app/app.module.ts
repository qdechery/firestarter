import {
  BrowserModule,
  BrowserTransferStateModule
} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from './core/auth.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// Firestarter App Modules
import { CoreModule } from './core/core.module';
import { UploadsModule } from './uploads/uploads.module';
import { UiModule } from './ui/ui.module';
import { NotesModule } from './notes/notes.module';

// AngularFire2 Modules
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireFunctionsModule } from 'angularfire2/functions';
import { AngularFireDatabaseModule } from 'angularfire2/database';

//Map Module
import { MapComponent } from './map/map.component';
import { NguiMapModule} from '@ngui/map';
import { VoteComponent } from './vote/vote.component';

// IMPORTANT
// Add your own project credentials to environments/*.ts

@NgModule({
  declarations: [AppComponent, MapComponent, VoteComponent],
  imports: [
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    AppRoutingModule,
    CoreModule,
    UiModule,
    NotesModule,
    UploadsModule,
    AngularFireModule.initializeApp(environment.firebase, 'firestarter'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    AngularFireDatabaseModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    NguiMapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyAXg1EdfqORW9vRMznLUkOzDS79qORUJ8E' }),
  ],
  providers: [ 
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
