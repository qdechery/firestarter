import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";


export interface Location { 
  id: string, 
  location: any[], 
  user: any[], 
  timeAdded: any[]; }

@Injectable({
  providedIn: 'root'
})
export class DestinationService {

  destCollection: AngularFirestoreCollection<Location>;
  destination: Observable<Location[]>;

  constructor(
    private http: HttpClient, 
    private destinationservice: DestinationService, 
    private afs: AngularFirestore
  ) { 

  }

  getAddress(coordinates){
  	return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+coordinates+'&key=AIzaSyAXg1EdfqORW9vRMznLUkOzDS79qORUJ8E')
  }

  getCoord(address){
	return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=AIzaSyAXg1EdfqORW9vRMznLUkOzDS79qORUJ8E')
  }

  whichPos(positions, event){
    // console.log(positions);
  	for (let i=0; i<positions.length; i++){
  		if(Array.isArray(positions[i])) {      
        if(positions[i][0] == event.latLng.lat()){
    			return i
    		}   		
    } else if (positions[i] instanceof Object){
          if(positions[i].lat() == event.latLng.lat()){
            return i
          }       
      }
  	}
  }

  whichId(latLng){
    this.destCollection = this.afs.collection<Location>('destinations');
    this.destination = this.destCollection.valueChanges();
    this.destination.subscribe(locations => {
      // console.log('locations:', locations, locations.length)
      for (let i=0; i<locations.length; i++){
        let lat = Number(locations[i].location[0].geometry.location.lat.toFixed(4));
        let lng = Number(locations[i].location[0].geometry.location.lng.toFixed(4));
        // console.log([lat, lng], latLng, JSON.stringify([lat, lng]) == JSON.stringify(latLng))
        if(JSON.stringify([lat, lng]) == JSON.stringify(latLng)){
          // console.log(locations[i])
          console.log(i)
          return i;
        }
      } 
    }
  }

  whichLoc(locations, firstevent, event){
	// console.log('whichLoc - locations: ',firstevent.lat, firstevent.lng);  	
	// console.log(event);  	
  	// var x = locations[0]
	console.log(locations);

  	for (let i=0; i<locations.length; i++){
  		let latlng=[];
  		let Firstlat = firstevent.lat,
  			Firstlng = firstevent.lng;
  		this.getCoord(locations[i]).subscribe(data => {
  			latlng.push(data['results'][0].geometry.location.lat);
  		})
  		this.getCoord(locations[i]).subscribe(data => {
			latlng.push(data['results'][0].geometry.location.lng);
  		})
  		var o = [20,40]
  		// console.log(o[0],o[1]);

  		// console.log('first - lat/lan: ', Firstlat, Firstlng);
  		// console.log('location - lat/lng: ', latlng, latlng[0], latlng[1]);
  		if(Firstlat == latlng[0] &&
 		   Firstlng == latlng[1]){
  				console.log(i);
  			// return i
  		}
	  }
  }

  // whichDestId(event){

  //   for 
  // }

}
