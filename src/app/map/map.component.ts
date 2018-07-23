import { Component, OnInit } from '@angular/core';
import { NguiMapModule } from '@ngui/map';
import { DestinationService } from './../destination.service';
import { HttpClient } from '@angular/common/http';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";
import { Observable } from 'rxjs';


import { AuthService, User } from '../core/auth.service';

export interface Item { id: string; name: string; }
export interface Location { id: string, location: string, user: string, timeAdded: string; }

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html'
  // styleUrls: ['./map.component.css']
})

export class MapComponent {
  positions: any[] = [];
  locations: any[] = [];
  events: any[] = [];
  itemRef: AngularFirestoreCollection<Item>;
  locRef: AngularFirestoreCollection<Location>;
  user: string;
  // private decimal: number = 6;

  constructor(
      private destinationservice: DestinationService, 
      private afs: AngularFirestore,
      private auth: AuthService,
  ) {
    // this.itemRef = afs.collection<Item>('items');
    // this.itemRef.add({id: '9', name: 'david'})
    this.auth.user.subscribe(user => this.user = user.displayName);
    
    // this.user = this.auth.user.subscribe(user => user.displayName);
  }

  onClick(event) {
  	if(event instanceof MouseEvent) return;
  	this.positions.push(event.latLng);
  	// console.log('Left Click: ', event.latLng.lat(), event.latLng.lng());
 	  var newLat = event.latLng.lat();
 	  var newLng = event.latLng.lng();
  	var modLatLng = newLat+","+newLng;
  	
    this.destinationservice.getAddress(modLatLng).subscribe(data => {
      var location = data['results'][1].formatted_address.split(",")[0]

      //Push location to UI array
    	this.locations.push(location)

      //Get Active User
      // var curUser = this.auth.user.subscribe(user => user.displayName);
      // var curUserStr = curUser.toString();
      // console.log(curUser);
      // this.auth.user.subscribe(user => console.log(user.displayName.toString()));
  		// console.log(this.auth.user);
      //Push Location to Datbase
      var dateNow = new Date().toDateString();
      var timeNow = new Date().toTimeString();
      var now = dateNow+timeNow;


      this.locRef = this.afs.collection<Location>('destinations');
      this.locRef.add({
        id: this.afs.createId(), 
        location: location, 
        user: this.user,
        timeAdded: now })
      // console.log(timeNow.toDateString(), timeNow.toTimeString())
    });

  }

  findLocation(event) {
  	let lat = event.latLng.lat();
  	let lng = event.latLng.lng(); 
  	if(this.events=[]){
 		this.events = [lat,lng];
  	}
  }

  onDrag(event){
	  var newLat = event.latLng.lat()
 	  var newLng = event.latLng.lng()
  	var modLatLng = newLat+","+newLng

  	if(event instanceof MouseEvent) return;

  	//1. Get Event lat/lng
  	var x=event.target.position.lat();

  	//2. Find the formatted_address

  	// find the right location to use
 	// console.log('Map - whichLoc: ',this.lookup.whichLoc(this.locations,this.events, event));
	  this.destinationservice.getAddress(modLatLng).subscribe(data=> {
		this.locations.splice(0,1,data['results'][0].formatted_address)
		// console.log(data['results'][0].formatted_address);
	})
  }

  onRightClick(event){
    //Remove Map Marker Destination
	  const index=this.destinationservice.whichPos(this.positions, event)
	  this.positions.splice(index, 1)
	  this.locations.splice(index, 1)
  }
}

