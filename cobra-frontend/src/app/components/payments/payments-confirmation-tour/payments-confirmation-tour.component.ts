import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-payments-confirmation-tour',
  templateUrl: './payments-confirmation-tour.component.html',
  styleUrls: ['./payments-confirmation-tour.component.scss']
})
export class PaymentsConfirmationTourComponent implements OnInit {

  currentDate: Date;

  constructor(
    public mediaObserver: MediaObserver
  ) { 
    this.currentDate = new Date();
  }

  get media(){
    return this.mediaObserver;
  };

  ngOnInit(): void {
  }

}
