import { Component, OnInit } from '@angular/core';
import { NguiMapModule } from '@ngui/map';
import { DestinationService } from './../destination.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html'
  // styleUrls: ['./map.component.css']
})

export class MapComponent {
  positions: any[] = [];
  locations: any[] = [];
  events: any[] = [];

  constructor(private destinationservice: DestinationService) { }

  onClick(event) {
  	if(event instanceof MouseEvent) return;
  	this.positions.push(event.latLng);
  	// console.log('Left Click: ', event.latLng.lat(), event.latLng.lng());
 	var newLat = event.latLng.lat()
 	var newLng = event.latLng.lng()
  	var modLatLng = newLat+","+newLng

  	this.destinationservice.getAddress(modLatLng).subscribe(data => {

  		this.locations.push(data['results'][1].formatted_address.split(",")[0])
  		// console.log(this.locations)
  	});

  }

  findLocation(event) {
  	let lat = event.latLng.lat();
  	let lng = event.latLng.lng(); 
  	if(this.events=[]){
 		this.events = [lat,lng];
  	}
 	// console.log(this.events);
  }

  onDrag(event){
	  var newLat = event.latLng.lat()
 	  var newLng = event.latLng.lng()
  	var modLatLng = newLat+","+newLng

  	if(event instanceof MouseEvent) return;

  	// console.log(event);

  	//1. Get Event lat/lng
  	var x=event.target.position.lat();
  	// console.log(this.locations);

  	//2. Find the formatted_address

  	// find the right location to use
 	// console.log('Map - whichLoc: ',this.lookup.whichLoc(this.locations,this.events, event));

	this.destinationservice.getAddress(modLatLng).subscribe(data=> {
		this.locations.splice(0,1,data['results'][0].formatted_address)
		// console.log(data['results'][0].formatted_address);
	})
  }

  onRightClick(event){
	// console.log('Right Click: ', this.lookup.whichPos(this.positions, event));
	const index=this.destinationservice.whichPos(this.positions, event)
	this.positions.splice(index, 1)
	this.locations.splice(index, 1)
	// console.log('Right Click: ', this.lookup.whichPos(this.positions, event));
	// console.log('Right Click: ',this.locations)
  }
}

