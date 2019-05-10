export interface Order {
  menuName: string;
  customerDetails: {
    contactName: string;
    orderNum: string;
    contactNum: string;
    pickUpDay: string;
    pickUpTime: string;
  };
  orderedItems: any[];
  notes: string;
  _id: string;
  __v: number;
}
