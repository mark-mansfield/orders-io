export interface Order {
  menuName: string;
  customerDetails: {
    contactName: string;
    email: string;
    orderNum: string;
    contactNum: number;
  };
  orderedItems: any[];
  eventDetails: {
    eventType: string;
    numberOfGuests: string;
    eventDate: string;
    deliveryTimeSelected: string;
    pickUpTimeSelected: string;
    deliveryAddress: string;
    stylingOptionSelected: string;
    eventStartTime: string;
    notes: string;
  };
  notes: string;
  id: string;
  __v: number;
}
