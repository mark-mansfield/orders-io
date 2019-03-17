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
}
export interface Import {
  data: string;
}
