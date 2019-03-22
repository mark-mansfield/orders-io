import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersFilterComponent } from './orders-filter.component';

describe('OrdersFilterComponent', () => {
  let component: OrdersFilterComponent;
  let fixture: ComponentFixture<OrdersFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
