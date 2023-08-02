import { Component, OnInit } from '@angular/core';
import { TourService } from 'ngx-ui-tour-md-menu';

@Component({
  selector: 'app-tour-help',
  templateUrl: './tour-help.component.html',
  styleUrls: ['./tour-help.component.scss']
})
export class TourHelpComponent implements OnInit {

  constructor(public tourService: TourService) { }

  ngOnInit(): void {
  }

}
