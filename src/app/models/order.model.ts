export interface Order {
  menuName: string;
  customerDetails: {
    contactName: string;
    email: string;
    orderNum: number;
    contactNum: number;
    pickUpDay: string;
    pickUpTime: string;
  };
  orderedItems: any[];
  eventDetails: {
    deliveryTimeSelected: string;
    pickUpTimeSelected: string;
    deliveryAddress: string;
    pickUpDateSelected: string;
    stylePackage: string;
    eventStartTime: string;
  };
  notes: string;
  _id: string;
  __v: number;
}
