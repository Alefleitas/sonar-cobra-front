import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {

  @Input() instructions: any;
  @Output() onClose = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  handleClose() {
    this.onClose.emit();
  }
}
