import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NguiMapModule } from '@ngui/map';

import { DestinationService } from './../destination.service';
import { PlacesService } from './../places.service';

import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService, User } from '../core/auth.service';

export interface Item { id: string; name: string; }
export interface Location { 
  id: string, 
  location: any[], 
  user: any[], 
  timeAdded: any[]; }

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html'
  // styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit { 
  positions: any[] = [];
  locations: any[] = [];
  placesPhotos: any[] = [];
  events: any[] = [];
  locUsers: any[] = [];
  destCollection: AngularFirestoreCollection<Location>;
  destination: Observable<Location[]>;
  locRef: AngularFirestoreCollection<Location>;
  user: string;
  userid: string;
  latlng: string;
  photo: any;
  startDrag: any[] = [];
  originalLoc: number;
  // destDocId: any<Location>;
  marker = {
    display: true,
    lat: null,
    lng: null,
  };
  zoomLat: string;
  zoomLng: string;
  // data: any[] = [];
  // private decimal: number = 6;

  constructor(
      private destinationservice: DestinationService, 
      private places: PlacesService, 
      private afs: AngularFirestore,
      private auth: AuthService,
  ) {
    // this.itemRef = afs.collection<Item>('items');
    // this.itemRef.add({id: '9', name: 'david'})
    this.auth.user.subscribe(user => {
      this.user = user.displayName;
      this.userid = user.uid;
    });
    
    // this.destCollection = this.afs.collection<Location>('destinations');
    // this.destination = this.destCollection.valueChanges();
    // this.destination.subscribe(locations => {
    //   console.log(locations)
    // })

    // this.user = this.auth.user.subscribe(user => user.displayName);
  }

  onMarkerClick({target: marker}){
    //Map Marker info
    // this.marker.lat = event.latLng.lat();
    // this.marker.lng = event.latLng.lng();

    marker.nguiMapComponent.openInfoWindow('iw', marker);
  }

  onClick(event) {
    if(event instanceof MouseEvent) return;

    //Get lat/lng of clicked position on map
    let newLat = event.latLng.lat();
    let newLng = event.latLng.lng();
    let modLatLng = newLat+","+newLng;

    //Get Date Time
    let dateNow = new Date().toDateString();
    let timeNow = new Date().toTimeString();

    //Push location to Destinations cloud firestore
    this.destinationservice.getAddress(modLatLng).subscribe(data => {
      let locData = data['results'];

      //Add destination to Firestore if lat/lng location request has results
      // console.log('data.results:',data.results.length==0);
      if(data.results.length != 0){       
        // Clear locations and positions arrays to avoid duplicating all destinations
        this.locations=[];
        this.positions=[];
    
        //Add new location to Firebase database.
        this.destCollection.add({
          id: this.afs.createId(), 
          location: locData,
          user: [this.user, this.userid],
          timeAdded: [dateNow, timeNow] 
        });
      }
    })
  }

  addDestinations(){
    this.destCollection = this.afs.collection<Location>('destinations');
    this.destination = this.destCollection.valueChanges();
    this.destination.subscribe(locations => {
      // console.log('addDest locations:', locations);
      this.locUsers =[]
      for (let i=0; i<locations.length; i++){
        if(locations[i].location.length > 0){      
          //Set lat and lng of each location in destinations collection from Firebase Firestore.
          let lat = locations[i].location[0].geometry.location.lat;
          let lng = locations[i].location[0].geometry.location.lng;
          //Push all positions from Firestore to this.positions array
          this.positions.push([lat, lng]);

          //Push all locations from Firestore to locations array 
          let labelLoc = locations[i].location[0].formatted_address
    
          //Push location to this.locations Array 
          this.locations.push(labelLoc);
          this.locUsers.push(locations[i])
        }
      }
      console.log('first this.locUsers.id:',this.locUsers)
    });
  }

  ngOnInit(){
    this.zoomLat = '37.608013';
    this.zoomLng = '-100.335167';
    this.addDestinations();
  }

  onStartDrag(event){
    //Variables to get event of initial mousedown event
    let startLat = Number(event.latLng.lat().toFixed(4));
    let startLng = Number(event.latLng.lng().toFixed(4));
    this.startDrag = [startLat, startLng];

    this.destination = this.destCollection.valueChanges();
    this.destination.subscribe(locations => {
      for (let i=0; i<locations.length; i++){
          // console.log('location i:',locations[i].location[0]);
        if(locations[i].location.length > 0){      
          let lat = Number(locations[i].location[0].geometry.location.lat.toFixed(4));
          let lng = Number(locations[i].location[0].geometry.location.lng.toFixed(4));
          if(JSON.stringify([lat, lng]) == JSON.stringify(this.startDrag)){
            return ;
          }
        }
      } 
    })
  }

  onDrag(event){

    if(event instanceof MouseEvent) return;

    // 1. Get mousedown event lat/lng
    let origLoc = this.startDrag
    // 2. Use that event lat/lng to retrieve the document ID
    let destId = '';
    let destDocId = 'B4ZU6I9F9F4bcgaaSW7Q';

    //Take snapshot of destinations collection and find which ID 
    //belongs to the event's lat/lng.
    this.destCollection.snapshotChanges().subscribe(locations => {
      //Get each location's lat/lng.
      for (let i=0; i<locations.length; i++){  
        let info = locations[i].payload.doc.data() as Location;
        // console.log('drag info:',info.location)        
        if(info.location.length > 0){
          let lat = Number(info.location[0].geometry.location.lat.toFixed(4));
          let lng = Number(info.location[0].geometry.location.lng.toFixed(4));

          //Assign destination ID if lat/lng of this document matches 
          //the lat/lng of right click event.
          // console.log('lat:',lat, 'lng:', lng, 'origLoc:', origLoc)
          if(JSON.stringify([lat, lng]) == JSON.stringify(origLoc)){
            // console.log('test')
            destId = locations[i].payload.doc.id;
            // destDocId = locations[i].payload.doc.data();
          }
        }
      }
    });
    // 3. Get mouseup event lat/lng 
    let startLat = Number(event.latLng.lat().toFixed(4));
    let startLng = Number(event.latLng.lng().toFixed(4));
    let eventLatLng = [startLat, startLng];
    // 4. Use mouseup event lat/lng to retrieve the location's data
    let newLat = event.latLng.lat();
    let newLng = event.latLng.lng();
    let modLatLng = newLat+","+newLng;
    let locData = []
    this.destinationservice.getAddress(modLatLng).subscribe(data=> {
        locData = data['results']
        // console.log('destinationservice.getaddres data:',data);
    })
    // 5. Replace the data in original document ID with new location's data.  
    setTimeout(() => {this.updateDraggedLoc(destId, destDocId, locData, this.user, this.userid)},500)
  }

  updateDraggedLoc(destId, destDocId, locationData, user, userid) { 
    this.locations=[];
    this.positions=[];
    //Get Date Time
    // console.log('destId:', destId, 'destDocId:', destDocId, 'locationData:', locationData, 'user:', user, 'userid:', userid)
    let dateNow = new Date().toDateString();
    let timeNow = new Date().toTimeString();
    this.destCollection.doc(destId).update({
        id: this.afs.createId(), 
        location: locationData,
        user: [user, userid],
        timeAdded: [dateNow, timeNow] 
      });
  }

  onRightClick(event){
    this.locations=[];
    this.positions=[];

    let startLat = Number(event.latLng.lat().toFixed(4));
    let startLng = Number(event.latLng.lng().toFixed(4));
    let eventLatLng = [startLat, startLng];

    //Remove Map Marker Destination
    // const index = this.destinationservice.whichPos(this.positions, event)

    //Get destination reference string
    let destId = '';

    //Take snapshot of destinations collection and find which ID 
    //belongs to the event's lat/lng.
    this.destCollection.snapshotChanges().subscribe(locations => {
      //Get each location's lat/lng.
      for (let i=0; i<locations.length; i++){
        // console.log('rightclick locations[i].payload.doc.data():', locations[i].payload.doc.data())
        if (locations[i].payload.doc.data().location.length > 0){
          let info = locations[i].payload.doc.data() as Location;
          let lat = Number(info.location[0].geometry.location.lat.toFixed(4));
          let lng = Number(info.location[0].geometry.location.lng.toFixed(4));

          //Assign destination ID if lat/lng of this document matches 
          //the lat/lng of right click event.
          if(JSON.stringify([lat, lng]) == JSON.stringify(eventLatLng)){
            destId = locations[i].payload.doc.id;
            // console.log('destId:', destId);
          }
        }  
      }
      //Dedupe both UI (locations) and marker (positions) arrays
      //Delete the refernced document ID based on right click event location
      this.destCollection.doc(destId).delete()
      //Remove from bogth locations (HTML list) and positions (markers) arrays
      // this.positions.splice(index, 1)
      // this.locations.splice(index, 1)
    }) 
  }
}

