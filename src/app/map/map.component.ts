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
  destCollection: AngularFirestoreCollection<Location>;
  destination: Observable<Location[]>;
  locRef: AngularFirestoreCollection<Location>;
  user: string;
  userid: string;
  latlng: string;
  photo: any;
  startDrag: any[] = [];
  originalLoc: number;
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
    
    // this.user = this.auth.user.subscribe(user => user.displayName);
  }



  onClick(event) {
    if(event instanceof MouseEvent) return;
    // Clear locations and positions arrays to avoid duplicating all destinations
    this.locations=[];
    this.positions=[];

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
      // console.log(locData);

      //Add destination to Firestore
      this.destCollection.add({
        id: this.afs.createId(), 
        location: locData,
        user: [this.user, this.userid],
        timeAdded: [dateNow, timeNow] 
      });
    })
  }

  addDestinations(){
    this.destCollection = this.afs.collection<Location>('destinations');
    this.destination = this.destCollection.valueChanges();
    this.destination.subscribe(locations => {
      for (let i=0; i<locations.length; i++){
        //Set lat and lng of each location in destinations collection from Firebase Firestore.
        let lat = locations[i].location[0].geometry.location.lat;
        let lng = locations[i].location[0].geometry.location.lng;
        //Push all positions from Firestore to this.positions array
        this.positions.push([lat, lng]);

        //Push all locations from Firestore to locations array 
        let labelLoc = locations[i].location[0].formatted_address
  
        //Push location to this.locations Array 
        this.locations.push(labelLoc);
      }
    });
  }

  ngOnInit(){
    this.addDestinations();
  }

  onStartDrag(event){
    let startLat = Number(event.latLng.lat().toFixed(4));
    let startLng = Number(event.latLng.lng().toFixed(4));
    this.startDrag = [startLat, startLng];

    this.destination = this.destCollection.valueChanges();
    this.destination.subscribe(locations => {
      for (let i=0; i<locations.length; i++){
        let lat = Number(locations[i].location[0].geometry.location.lat.toFixed(4));
        let lng = Number(locations[i].location[0].geometry.location.lng.toFixed(4));
        if(JSON.stringify([lat, lng]) == JSON.stringify(this.startDrag)){
          console.log(i)
          return ;
        }
      } 
    })
    // console.log(this.startDrag);
    // this.originalLoc = this.destinationservice.whichId(this.startDrag);
    // console.log(this.destinationservice.whichId(this.startDrag));
  }

  onDrag(event){

    // 1. Get mousedown event lat/lng
    // 2. Use that event lat/lng to retrieve the document ID
    // 3. Get mouseup event lat/lng 
    // 4. Use mouseup event lat/lng to retrieve the location's data
    // 5. Make object like onClick of the replacement document's data
    // 6. Replace the data in original document ID with new location's data.

    console.log('mouseup drag finish event:', event)
    //Variables for retrieving firestore doc ID
    let startLat = Number(event.latLng.lat().toFixed(4));
    let startLng = Number(event.latLng.lng().toFixed(4));
    let eventLatLng = [startLat, startLng];

    console.log('this.startDrag:', this.onStartDrag(eventLatLng))
  	//1. Get Event lat/lng
    //Variables for retrieving address of dropped pin after dragging
    let newLat = event.latLng.lat();
    let newLng = event.latLng.lng();
    let modLatLng = newLat+","+newLng;

    if(event instanceof MouseEvent) return;

  	//2. Find the formatted_address
  	// find the right location to use
 	  // console.log('Map - whichLoc: ',this.lookup.whichLoc(this.locations,this.events, event));
	  
    this.destinationservice.getAddress(modLatLng).subscribe(data=> {
        console.log('destinationservice.getaddres data:',data);
    // this.locations.splice(this.originalLoc,1,data['results'][0].formatted_address)
		// console.log('this.originalLoc:',this.originalLoc,'data results0:',data['results'][0].formatted_address);
	  // console.log(data['results'])

    })

    // this.destination = this.destCollection.snapshotChanges()
    // this.destination.subscribe(locations => {
    //   for (let i=0; i<locations.length; i++){  
    //     let info = locations[i].payload.doc.data() as Location;

    //     // console.log(locations[i].payload.doc.id, ...info);
    //     let lat = Number(info.location[0].geometry.location.lat.toFixed(4));
    //     let lng = Number(info.location[0].geometry.location.lng.toFixed(4));

    //     if(JSON.stringify([lat, lng]) == JSON.stringify(eventLatLng)){
    //       destId = locations[i].payload.doc.id;
    //       // console.log('destId:', destId);
    //     }
    //   }
    // })
  }

  onRightClick(event){
    this.locations=[];
    this.positions=[];

    let startLat = Number(event.latLng.lat().toFixed(4));
    let startLng = Number(event.latLng.lng().toFixed(4));
    let eventLatLng = [startLat, startLng];

    //Remove Map Marker Destination
    const index = this.destinationservice.whichPos(this.positions, event)

    //Get destination reference string
    let destId = '';

    //Take snapshot of destinations collection and find which ID 
    //belongs to the event's lat/lng.
    this.destCollection.snapshotChanges().subscribe(locations => {
      //Get each location's lat/lng.
      for (let i=0; i<locations.length; i++){  
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
      //Dedupe both UI (locations) and marker (positions) arrays
      //Delete the refernced document ID based on right click event location
      this.destCollection.doc(destId).delete()
      //Remove from bogth locations (HTML list) and positions (markers) arrays
      // this.positions.splice(index, 1)
      // this.locations.splice(index, 1)
    }) 
  }
}

