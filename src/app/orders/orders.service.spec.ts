import { TestBed, inject } from '@angular/core/testing';

import { OrderService } from '../services/order.service';

describe('OrdersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderService]
    });
  });

  it('should be created', inject([OrderService], (service: OrderService) => {
    expect(service).toBeTruthy();
  }));
});
