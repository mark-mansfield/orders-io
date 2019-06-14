import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterDishesComponent } from './search-filter-dishes.component';

describe('SearchFilterDishesComponent', () => {
  let component: SearchFilterDishesComponent;
  let fixture: ComponentFixture<SearchFilterDishesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFilterDishesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFilterDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
