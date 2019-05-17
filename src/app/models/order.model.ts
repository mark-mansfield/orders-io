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
  notes: string;
  _id: string;
  __v: number;
}
