export interface Order {
  menuName: string;
  customerDetails: {
    contactName: string;
    email: string;
    orderNum: string;
    contactNum: number;
    pickUpDay: string;
    pickUpTime: string;
  };
  orderedItems: any[];
  eventDetails: {
    eventType: string;
    eventDate: string;
    deliveryTimeSelected: string;
    pickUpTimeSelected: string;
    deliveryAddress: string;
    stylePackage: string;
    eventStartTime: string;
  };
  notes: string;
  id: string;
  __v: number;
}
