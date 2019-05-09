import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dish-details-edit',
  templateUrl: './dish-details-edit.component.html',
  styleUrls: ['./dish-details-edit.component.css']
})
export class DishDetailsEditComponent implements OnInit {
  @Input() data: any;
  @Input() editMode: any;
  constructor() {}

  ngOnInit() {}
}
