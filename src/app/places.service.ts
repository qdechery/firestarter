import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private http: HttpClient) { }


  getPlacePhoto(location){
  	return this.http.get('https://maps.googleapis.com/maps/api/streetview?size=400x400&location=47.622204,-122.307900&fov=90&heading=235&pitch=10&key=AIzaSyAXg1EdfqORW9vRMznLUkOzDS79qORUJ8E');
  }
}
