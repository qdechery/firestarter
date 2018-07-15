import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {

  locations: any[] = [];

  constructor() { }

  ngOnInit() {
  }

}
