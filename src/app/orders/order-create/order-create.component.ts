import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from '../../models/order.model';
import { environment } from '../../../environments/environment';
import { OrderService } from '../../services/order.service';
import { DishService } from '../../services/dish.service';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {

  // provides ref to scroll to in case of form errors
  @ViewChild('#formStart')
  @Input('menus')
  set menus(menus: any) {
    this._menus = menus;
  }

  get menus() {
    return this._menus;
  }

  @Input('uniqueId')
  set uniqueId(uniqueId: string) {
    this._uniqueId = uniqueId;
  }
  get uniqueId(): string {
    return this._uniqueId;
  }

  @Input('mode')
  set mode(mode: string) {
    this._formMode = mode;
  }
  get mode(): string {
    return this._formMode;
  }

  @Input('selectedItem')
  set selectedItem(selectedItem: any) {
    this._selectedItem = selectedItem;
  }

  get selectedItem(): any {
    return this._selectedItem;
  }


  // input data
  _uniqueId = '';
  _formMode = '';
  _menus = null;
  _selectedItem = null;

  // prevent any date in the past
  today = new Date();
  year = this.today.getFullYear();
  day = this.today.getDate();
  month = this.today.getMonth();
  minDate = new Date(this.year, this.month, this.day);

  // set event date like this
  // eventDateTmp = new Date(this.year, this.month, this.day + 2); [value]="eventDateTmp"

  order: Order;
  notes: string;
  // menuName: string;
  formTitle: string;
  form: FormGroup;


  dishes: any = [];
  itemsOnMenu: any = [];

  // object properties all could be enhanced to come from api
  // menus = ['rosh hashanah', 'menu 2', 'menu 3'];
  delivery_time_options = ['10.30am', '11.00am', '11.30am', '4.30pm', '5.00pm', '5.30pm'];
  pickup_time_options = ['3.30pm', '4.00pm', '4.30pm', '5.00pm'];
  styling_options = ['none', '$', '$$$', '$$$$$'];
  quantities = ['1', '2', '3', '4'];
  portion_sizes = [];



  // object constants
  EVENT_TYPES = environment.eventOptions; // <-- should remain constant
  EVENT_START_TIME_OPTIONS = environment.eventStartTimeOptions; // <-- should remain constant

  eventType = null;
  deliveryTimeSelected = null;
  pickUpTimeSelected = null;
  deliveryAddress = null;
  pickUpDateSelected = null;
  stylingOptionSelected = null;
  menuSelected = null;
  eventStartTimeSelected = null;

  menuNames = [];
  eventDate = null;
  eventStartTime = null;
  formattedDate = null;
  pickUp = false;
  delivery = false;
  staffed = false;
  limitedPickUpDates = true;
  styling = false;

  serverDate = null;
  serverDateFormatted = null;

  // UI state
  formMode = null;
  inputDisabled = true;
  submitted = false;
  isDuplicate = false;
  disableSubmit = true;
  isLoading = true;



  constructor(

    public orderService: OrderService,
    public dishService: DishService,
    private formBuilder: FormBuilder) { }

  @Output()
  notify = new EventEmitter<boolean>();

  notifyParent() {
    console.log('navigation back fired');
    this.form.reset();
    this.notify.emit(true);
  }

  // make some form fields required under certain conditions
  setConditionalFormFieldValidators() {
    const pickUpTimeSelector = this.form.get('pickUpTime');
    const addressSelector = this.form.get('address');
    const deliveryTimeSelector = this.form.get('deliveryTime');
    const stylingOptionsSelector = this.form.get('stylingOptions');
    const eventStartTimeSelector = this.form.get('eventStartTime');
    const eventTypeSelector = this.form.get('eventType').valueChanges.subscribe(selected => {
      console.log(selected);
      if (selected === 'pick_up') {
        pickUpTimeSelector.setValidators([Validators.required]);
        pickUpTimeSelector.updateValueAndValidity();
        addressSelector.setValidators(null);
        deliveryTimeSelector.setValidators(null);
        stylingOptionsSelector.setValidators(null);
        eventStartTimeSelector.setValidators(null);
      }

      if (selected === 'delivery_service') {
        pickUpTimeSelector.setValidators(null);
        stylingOptionsSelector.setValidators(null);
        eventStartTimeSelector.setValidators(null);

        addressSelector.setValidators([Validators.required]);
        deliveryTimeSelector.setValidators([Validators.required]);

        addressSelector.updateValueAndValidity();
        deliveryTimeSelector.updateValueAndValidity();
      }
      if (selected === 'staffed_event') {
        pickUpTimeSelector.setValidators(null);
        addressSelector.setValidators(null);

        deliveryTimeSelector.setValidators([Validators.required]);
        stylingOptionsSelector.setValidators([Validators.required]);
        eventStartTimeSelector.setValidators([Validators.required]);

        deliveryTimeSelector.updateValueAndValidity();
        stylingOptionsSelector.updateValueAndValidity();
        eventStartTimeSelector.updateValueAndValidity();
      }
    });
  }

  ngOnInit() {

    this._menus.forEach(item => {
      this.menuNames.push(item.title);
    });

    this.isLoading = false;
    const regexPattern = '[a-zA-Z0-9/s\t\n\r, \\.]*';
    if (this.mode === 'create') {
      this.formTitle = 'Create new order';
      this.inputDisabled = false;
      this.form = this.formBuilder.group({
        contactName: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        notes: ['', [Validators.pattern(regexPattern)]],
        address: ['', [Validators.pattern(regexPattern)]],
        eventType: ['', Validators.required],
        menu: ['', Validators.required],
        numberOfGuests: ['', Validators.required],
        eventDate: ['', Validators.required],
        pickUpTime: [''],
        deliveryTime: [''],
        stylingOptions: [''],
        eventStartTime: ['']
      });
    }

    if (this.mode === 'view') {
      this.formTitle = 'Editing this order';
      this.dishes = this.selectedItem.orderedItems;
      this.eventType = this.selectedItem.eventDetails.eventType;
      this.pickUpTimeSelected = this.selectedItem.eventDetails.pickUpTimeSelected + 'pm';
      this.deliveryTimeSelected = this.selectedItem.eventDetails.deliveryTimeSelected;
      this.stylingOptionSelected = this.selectedItem.eventDetails.stylingOptionSelected;
      this.eventStartTimeSelected = this.selectedItem.eventDetails.eventStartTime;
      this.deliveryAddress = this.selectedItem.eventDetails.deliveryAddress;
      // this.initItemsOnMenu(this.selectedItem.orderedItems);
      const idx = this.menus.findIndex(p => p.title === this.selectedItem.menuName);
      this.menuSelected = this.menus[idx];
      this.initItemsOnMenu(this.menuSelected.items);

      this.form = this.formBuilder.group({
        contactName: [
          { value: this.selectedItem.customerDetails.contactName, disabled: this.inputDisabled },
          Validators.required
        ],
        phone: [
          { value: this.selectedItem.customerDetails.contactNum, disabled: this.inputDisabled },
          Validators.required
        ],
        email: [
          { value: this.selectedItem.customerDetails.email, disabled: this.inputDisabled },
          [Validators.required, Validators.email]
        ],
        notes: [
          { value: this.selectedItem.eventDetails.notes, disabled: this.inputDisabled },
          [Validators.pattern('[a-zA-Z0-9 .]*')]
        ],
        address: [{ value: this.selectedItem.eventDetails.deliveryAddress, disabled: this.inputDisabled }],
        eventType: [
          { value: this.selectedItem.eventDetails.eventType, disabled: this.inputDisabled },
          Validators.required
        ],

        menu: [{ value: this.selectedItem.menuName, disabled: this.inputDisabled }, Validators.required],
        numberOfGuests: [
          { value: this.selectedItem.eventDetails.numberOfGuests, disabled: this.inputDisabled },
          Validators.required
        ],
        eventDate: [
          { value: this.selectedItem.eventDetails.eventDate, disabled: this.inputDisabled },
          Validators.required
        ],
        pickUpTime: [{ value: this.pickUpTimeSelected, disabled: this.inputDisabled }, this.getValidators(this.eventType)],
        deliveryTime: [{ value: this.deliveryTimeSelected, disabled: this.inputDisabled }],
        stylingOptions: [{ value: this.stylingOptionSelected, disabled: this.inputDisabled }],
        eventStartTime: [{ value: this.eventStartTimeSelected, disabled: this.inputDisabled }]
      });

      this.serverDate = new Date(this.selectedItem.eventDetails.eventDate);
      this.serverDateFormatted = this.orderService.formatDate(this.serverDate);
    }

    this.setConditionalFormFieldValidators();
  }

  getValidators(object) {
    return Validators.required;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onDateChange(date) {
    this.serverDateFormatted = this.orderService.formatDate(date);
  }

  enableForm() {
    this.form.controls.contactName.reset({ value: this.selectedItem.customerDetails.contactName, disabled: false });
    this.form.controls.phone.reset({ value: this.selectedItem.customerDetails.contactNum, disabled: false });
    this.form.controls.email.reset({ value: this.selectedItem.customerDetails.email, disabled: false });
    this.form.controls.notes.reset({ value: this.selectedItem.eventDetails.notes, disabled: false });
    this.form.controls.address.reset({ value: this.selectedItem.eventDetails.deliveryAddress, disabled: false });
    this.form.controls.eventType.reset({ value: this.selectedItem.eventDetails.eventType, disabled: false });
    this.form.controls.menu.reset({ value: this.selectedItem.menuName, disabled: false });
    this.form.controls.numberOfGuests.reset({
      value: this.selectedItem.eventDetails.numberOfGuests,
      disabled: false
    });
    this.form.controls.eventDate.reset({ value: this.selectedItem.eventDetails.eventDate, disabled: false });
    this.form.controls.pickUpTime.reset({ value: this.pickUpTimeSelected, disabled: false });
    this.form.controls.deliveryTime.reset({ value: this.deliveryTimeSelected, disabled: false });
    this.form.controls.stylingOptions.reset({ value: this.stylingOptionSelected, disabled: false });
    this.form.controls.eventStartTime.reset({ value: this.eventStartTimeSelected, disabled: false });
    console.log(this.form.status);
  }

  disableForm() {
    this.form.controls.contactName.reset({ value: this.selectedItem.customerDetails.contactName, disabled: false });
    this.form.controls.phone.reset({ value: this.selectedItem.customerDetails.contactNum, disabled: true });
    this.form.controls.email.reset({ value: this.selectedItem.customerDetails.email, disabled: true });
    this.form.controls.notes.reset({ value: this.selectedItem.eventDetails.notes, disabled: true });
    this.form.controls.address.reset({ value: this.selectedItem.customerDetails.address, disabled: true });
    this.form.controls.eventType.reset({ value: this.selectedItem.eventDetails.eventType, disabled: true });
    this.form.controls.menu.reset({ value: this.selectedItem.MenuName, disabled: true });
    this.form.controls.numberOfGuests.reset({
      value: this.selectedItem.eventDetails.numberOfGuests,
      disabled: true
    });
    this.form.controls.eventDate.reset({ value: this.selectedItem.eventDetails.eventDate, disabled: true });
    this.form.controls.pickUpTime.reset({ value: this.pickUpTimeSelected, disabled: true });
    this.form.controls.deliveryTime.reset({ value: this.deliveryTimeSelected, disabled: true });
    this.form.controls.stylingOptions.reset({ value: this.stylingOptionSelected, disabled: true });
    this.form.controls.eventStartTime.reset({ value: this.eventStartTime, disabled: true });
  }

  //

  updateFormMode(mode) {
    if (mode === 'create') {
      this.form.reset();
      this.enableForm();
    }
    if (mode === 'edit') {
      this.inputDisabled = false;
      this.enableForm();
    }
    if (mode === 'view') {
      this.inputDisabled = true;
      this.disableForm();
    }
    if (mode === null) {
      this.inputDisabled = true;
      this.submitted = false;
      this.disableForm();
    }

    this.mode = mode;
    console.log(this.mode);
  }

  updateItemQty(index, item) {
    this.itemsOnMenu[index].qty = item;
    console.log(item);
  }

  setEventType(type) {
    this.deliveryAddress = null;
    this.deliveryTimeSelected = null;
    this.eventStartTime = null;
    this.eventType = type;
    this.eventDate = null;
    this.pickUpDateSelected = null;
    this.pickUpTimeSelected = null;
    this.stylingOptionSelected = null;
  }

  onSelectEventType(item) {
    this.setEventType(item);
    this.eventType = item;
    if (item === 'pick_up') {
      this.pickUp = true;
      this.delivery = false;
      this.staffed = false;
    } else if (item === 'delivery_service') {
      this.pickUp = false;
      this.staffed = false;
      this.delivery = true;
    } else if (item === 'staffed_event') {
      this.staffed = true;
      this.delivery = false;
      this.pickUp = false;
    }
  }

  onUpdateDeliveryAddress(item) {
    console.log(item);
    this.deliveryAddress = item;
    // console.log(`Delivery Address ${this.deliveryAddress}`);
  }

  // make  each dish into order item object  { name: string,  quantity: string }
  initItemsOnMenu(arr) {

    this.itemsOnMenu = [];
    arr.forEach(item => {
      console.log(item);
      const orderItem = {
        name: item.name,
        qty: item.qty,
        portion_sizes: item.portion_sizes
      };
      this.itemsOnMenu.push(orderItem);
    });

  }



  onSelectMenu(value) {
    console.log(value)
    if (value === 'none') {
      this.form.controls.menu.reset({ value: '', disabled: false });
    }
    const idx = this.menus.findIndex(p => p.title === value);
    this.menuSelected = this.menus[idx];
    this.initItemsOnMenu(this.menuSelected.items);
  }

  onSelectDeliveryTime(time) {
    this.deliveryTimeSelected = time;
    // console.log(`Delivery time selected ${this.deliveryTimeSelected}`);
  }

  onSelectPickUpTime(time) {
    const str = time.split('');
    const trimmedValue = str.slice(0, 4);
    this.pickUpTimeSelected = trimmedValue.join('');
    console.log(`pick up time : ${this.pickUpTimeSelected}`);
  }

  onSelectEventStartTime(time) {
    this.eventStartTime = time;
    // console.log(`event start time ${time}`);
  }

  onSelectStylingOption(option) {
    this.stylingOptionSelected = option;
    // console.log(`stying package selected ${option}`);
  }

  onDeleteOrder(_id) {
    this.orderService.deleteOrder(_id);
    this.notifyParent();
  }

  onSaveOrder() {
    this.submitted = true;
    console.log(this.form);
    if (this.form.invalid) {
      document.querySelector('#formStart').scrollIntoView({ behavior: 'smooth' });
      console.log(this.form);
      console.log('form is invalid');
      return;
    }
    console.log(this.form.controls.eventDate);
    // start spinner
    // this.isLoading = true;

    if (this.mode === 'edit') {
      const exisitngOrder = {
        menuName: this.form.value.menuName,
        customerDetails: {
          contactName: this.form.value.contactName,
          email: this.form.value.email,
          orderNum: this.uniqueId,
          contactNum: this.form.value.phone
        },
        eventDetails: {
          eventType: this.eventType,
          eventDate: this.form.value.eventDate,
          numberOfGuests: this.form.value.numberOfGuests,
          deliveryTimeSelected: this.deliveryTimeSelected,
          pickUpTimeSelected: this.pickUpTimeSelected,
          deliveryAddress: this.deliveryAddress,
          stylingOptionSelected: this.stylingOptionSelected,
          eventStartTime: this.eventStartTime,
          notes: this.form.value.notes
        },
        orderedItems: this.itemsOnMenu,
        notes: this.form.value.notes,
        _id: this.selectedItem._id,
        __v: null
      };
      this.orderService.updateSingleOrder(exisitngOrder);
    }
    if (this.mode === 'create') {
      this.order = {
        menuName: this.menuSelected.title,
        customerDetails: {
          contactName: this.form.value.contactName,
          email: this.form.value.email,
          orderNum: this.uniqueId,
          contactNum: this.form.value.phone
        },
        eventDetails: {
          eventType: this.eventType,
          eventDate: this.form.value.eventDate,
          numberOfGuests: this.form.value.numberOfGuests,
          deliveryTimeSelected: this.deliveryTimeSelected,
          pickUpTimeSelected: this.pickUpTimeSelected,
          deliveryAddress: this.deliveryAddress,
          stylingOptionSelected: this.stylingOptionSelected,
          eventStartTime: this.eventStartTime,
          notes: this.form.value.notes
        },
        orderedItems: this.itemsOnMenu,
        notes: this.form.value.notes,
        id: null,
        __v: null
      };
      this.orderService.createOrder(this.order);
    }
    console.log(this.order);
    // this.form.reset();
    // this.notifyParent();
  }
}
