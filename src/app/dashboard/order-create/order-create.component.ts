import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {
  constructor() {}
  @Output() navigationBack = new EventEmitter<boolean>();

  navigateBack() {
    this.navigationBack.emit(true);
  }
  ngOnInit() {}
}
