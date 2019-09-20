import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Order } from '../models/order.model';
import { OrderService } from '../services/order.service';
@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['../orders/orders-list/orders-list.component.css']
})
export class DialogsComponent implements OnInit {
  constructor(
    public ordersService: OrderService,
    public dialogRef: MatDialogRef<DialogsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  customerDetailsKeyRefs = [];
  customerDetailsKeyValues = [];
  orderedItemsKeyRefs = [];
  orderedItemsKeyValues = [];
  editMode = false;
  orderEdited = false;
  currentOrder: any;
  newOrder: any;

  ngOnInit() {
    this.newOrder = JSON.parse(JSON.stringify(this.data));
    console.log(this.newOrder);
    this.customerDetailsKeyRefs = this.ordersService.returnObjKeys(this.newOrder.customerDetails);
    this.customerDetailsKeyValues = this.ordersService.returnObjValues(this.newOrder.customerDetails);
    this.orderedItemsKeyRefs = this.ordersService.returnObjKeys(this.newOrder.orderedItems);
    this.orderedItemsKeyValues = this.ordersService.returnObjValues(this.newOrder.orderedItems);
    // console.log(this.customerDetailsKeyRefs);
    // console.log(this.customerDetailsKeyValues);
    // console.log('ordered items');
    // console.log(this.orderedItemsKeyRefs);
    // console.log(this.orderedItemsKeyValues);
  }

  toggleEditMode() {
    if (this.editMode) {
      this.editMode = false;
    } else {
      this.editMode = true;
    }
  }

  udpdateItem(objRef, objKey, event) {
    // so we can update the specific nested object

    let transformedObjKey;
    switch (objRef) {
      case 'customerDetails':
        if (objKey.includes(' ')) {
          transformedObjKey = this.ordersService.camelCaseValue(objKey);
        }
        this.newOrder.customerDetails[transformedObjKey] = event.target.value;
        this.orderEdited = true;
        break;
      case 'orderedItems':
        // console.log(`editing ${transformedObjKey}`);
        this.newOrder.orderedItems[transformedObjKey] = event.target.value;
        this.orderEdited = true;
        break;
      default:
        break;
    }
  }

  saveOrder(order) {
    // console.log(this.orderEdited);
    if (this.orderEdited) {
      this.dialogRef.close(order);
    } else {
      alert(' Edit an item first please!');
    }
    // console.log(order);
  }
}
