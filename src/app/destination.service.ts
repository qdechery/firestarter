import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {

  constructor(private http: HttpClient) { }

  getAddress(coordinates){
  	return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+coordinates+'&key=AIzaSyAXg1EdfqORW9vRMznLUkOzDS79qORUJ8E')
  }

  getCoord(address){
	return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=AIzaSyAXg1EdfqORW9vRMznLUkOzDS79qORUJ8E')
  }

  whichPos(positions, event){
  	for (let i=0; i<positions.length; i++){
  		if(positions[i].lat() == event.latLng.lat()){
  			return i
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

}
