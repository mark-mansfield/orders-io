import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishDetailsEditComponent } from './dish-details-edit.component';

describe('DishDetailsEditComponent', () => {
  let component: DishDetailsEditComponent;
  let fixture: ComponentFixture<DishDetailsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishDetailsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
