import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from '../../models/order.model';
import { environment } from '../../../environments/environment';
import { OrderService } from '../../services/order.service';
import { DishService } from '../../services/dish.service';
import { DateAdapter } from '@angular/material';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {
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
  menuName: string;
  form: FormGroup;

  dishes: any = [];
  itemsOnMenu: any = [];

  // object properties all could be enhanced to come from api
  menus = ['rosh hashanah', 'menu 2', 'menu 3'];
  delivery_time_options = ['10.30am', '11.00am', '11.30am', '4.30pm', '5.00pm', '5.30pm'];
  pickup_time_options = ['3.30pm', '4.00pm', '4.30pm', '5.00pm'];
  styling_options = ['none', '$', '$$$', '$$$$$'];

  // object constants
  EVENT_TYPES = environment.eventOptions; // <-- should remain constant
  EVENT_START_TIME_OPTIONS = environment.eventStartTimeOptions; // <-- should remain constant

  menu = {
    _id: '5b8aa5ff78bf462cbfab5903',
    title: 'rosh hashanah',
    description: 'aaaaa',
    limitedPickUpDates: false,
    items: [
      {
        name: 'Slow_Cooked_Lamb_Shoulder',
        description: 'Hawaiij spices, pomegranate molasses, honey and lemon w coriander and almonds',
        portion_sizes: [0, 1, 2, 3],
        course: 'main'
      },
      {
        name: 'Grilled_Ora_king_salmon',
        description: 'chermoula marinade, cherry tomato and green bean salsa',
        portion_sizes: [0, 1, 2, 3],
        course: 'main'
      },
      {
        name: 'Ocean_trout_tarator',
        description: 'w tahini yoghurt, coriander, sumac and chilli',
        portion_sizes: [0, 1, 2, 3],
        course: 'main'
      },
      {
        name: 'Slow_Braised_Free_Range_Chicken',
        description: 'Jerusalem artichokes, bay, lemon, olives, eschallots , dates (Legs and thighs- 18 pieces)',
        portion_sizes: [0, 1],
        course: 'main'
      },
      {
        name: 'chopped_liver',
        description: 'w caramelised onions egg &amp; herb mayo',
        portion_sizes: ['0', '250', '500', '1kg'],
        course: 'entree'
      },
      {
        name: 'hommus',
        description: "Lox's famous chick pea hummus used at the restaurant",
        portion_sizes: ['0', '250', '500', '1kg'],
        course: 'entree'
      },
      {
        name: 'confit_tuna',
        description: 'Olive oil, caper and parsley dip',
        portion_sizes: ['0', '250', '500', '1kg'],
        course: 'entree'
      },
      {
        name: 'Romanian_eggplant',
        description: 'roasted eggplant, capsicum, pomegranate, dill, lemon, shallot)',
        portion_sizes: ['250', '500', '1kg'],
        course: 'entree'
      },
      {
        name: 'holmbrae_chicken_and_vegetable ',
        description: 'DF',
        portion_sizes: ['250', '500', '1kg'],
        course: 'soup'
      }
    ],
    imagePath: 'http://localhost:3000/images/rosh-hashanah-1552960275177.jpg',
    creator: '5b89d99441204620fb7fa0d4',
    __v: 0
  };

  eventType = null;
  deliveryTimeSelected = null;
  pickUpTimeSelected = null;
  deliveryAddress = null;
  pickUpDateSelected = null;
  stylingOptionSelected = null;
  eventStartTimeSelected = null;
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

  //input data
  private _uniqueId = '';
  private _formMode = '';
  private _selectedItem = null;

  constructor(public orderService: OrderService, public dishService: DishService, private formBuilder: FormBuilder) {}

  @ViewChild('#formStart')
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
    const eventTypeSelector = this.form.get('eventType').valueChanges.subscribe(eventTypeSelector => {
      console.log(eventTypeSelector);
      if (eventTypeSelector === 'pick_up') {
        pickUpTimeSelector.setValidators([Validators.required]);
        pickUpTimeSelector.updateValueAndValidity();

        addressSelector.setValidators(null);
        deliveryTimeSelector.setValidators(null);
        stylingOptionsSelector.setValidators(null);
        eventStartTimeSelector.setValidators(null);
      }

      if (eventTypeSelector === 'delivery_service') {
        pickUpTimeSelector.setValidators(null);
        stylingOptionsSelector.setValidators(null);
        eventStartTimeSelector.setValidators(null);

        addressSelector.setValidators([Validators.required]);
        deliveryTimeSelector.setValidators([Validators.required]);

        addressSelector.updateValueAndValidity();
        deliveryTimeSelector.updateValueAndValidity();
      }
      if (eventTypeSelector === 'staffed_event') {
        pickUpTimeSelector.setValidators(null);
        addressSelector.setValidators(null);

        deliveryTimeSelector.setValidators([Validators.required]);
        stylingOptionsSelector.setValidators([Validators.required]);
        eventStartTimeSelector.setValidators([Validators.required]);

        // addressSelector.updateValueAndValidity();
        deliveryTimeSelector.updateValueAndValidity();
        stylingOptionsSelector.updateValueAndValidity();
        eventStartTimeSelector.updateValueAndValidity();
      }
    });
  }

  ngOnInit() {
    console.log(this.selectedItem);
    console.log(this.mode);
    this.isLoading = false;
    const regexPattern = '[a-zA-Z0-9/s\t\n\r, \\.]*';
    this.limitedPickUpDates = this.menu.limitedPickUpDates;
    if (this.mode === 'create') {
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
      // const localDateHack = new Date(this.selectedItem.eventDetails.eventDate.replace(/-/g, '/').replace(/T.+/, ''));
      // console.log(this.selectedItem.eventDetails.eventDate);
      // console.lo(localDateHack)
      this.eventType = this.selectedItem.eventDetails.eventType;
      this.pickUpTimeSelected = this.selectedItem.eventDetails.pickUpTimeSelected + 'pm';
      this.deliveryTimeSelected = this.selectedItem.eventDetails.deliveryTimeSelected;
      this.stylingOptionSelected = this.selectedItem.eventDetails.stylingOptionSelected;
      this.eventStartTimeSelected = this.selectedItem.eventDetails.eventStartTime;
      this.deliveryAddress = this.selectedItem.eventDetails.deliveryAddress;
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
        pickUpTime: [{ value: this.pickUpTimeSelected, disabled: this.inputDisabled }],
        deliveryTime: [{ value: this.deliveryTimeSelected, disabled: this.inputDisabled }],
        stylingOptions: [{ value: this.stylingOptionSelected, disabled: this.inputDisabled }],
        eventStartTime: [{ value: this.eventStartTimeSelected, disabled: this.inputDisabled }]
      });

      this.serverDate = new Date(this.selectedItem.eventDetails.eventDate);
      this.serverDateFormatted = this.orderService.formatDate(this.serverDate);
    }

    this.dishes = this.menu.items;
    this.menu.items.forEach(item => {
      const orderItem = {
        name: item.name,
        qty: ''
      };
      this.itemsOnMenu.push(orderItem);
    });

    this.setConditionalFormFieldValidators();
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

  updateFormMode(mode) {
    if (mode === 'create') {
      this.form.reset();
      this.enableForm();
    }
    if (mode === 'edit') {
      this.inputDisabled = false;
      console.log(this.selectedItem);
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
    // console.log(this.itemsOnMenu[index]);
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

    // console.log(`Event type is a ${item} event`);
  }

  onUpdateDeliveryAddress(item) {
    console.log(item);
    this.deliveryAddress = item;
    // console.log(`Delivery Address ${this.deliveryAddress}`);
  }

  onSelectMenu(value) {
    this.menuName = value;
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

  // calendar events
  // setEventDate(value) {
  //   // moment object ._i = {year: 2019, month: 5, date: 5}
  //   console.log(value);
  //   const date = value._i;
  //   this.formattedDate = date.date + '/' + date.month + '/' + date.year;
  //   console.log(this.formattedDate);
  //   // this.form.controls.eventDate.value = value._i;
  // }

  onDeleteOrder(_id) {
    this.orderService.deleteOrder(_id);
    this.notifyParent();
  }

  onSaveOrder() {
    this.submitted = true;
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
        menuName: this.form.value.menu,
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
        menuName: this.form.value.menu,
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

    this.form.reset();
    this.notifyParent();
  }
}
