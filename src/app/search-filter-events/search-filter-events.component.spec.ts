import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterEventsComponent } from './search-filter-events.component';

describe('SearchFilterEventsComponent', () => {
  let component: SearchFilterEventsComponent;
  let fixture: ComponentFixture<SearchFilterEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFilterEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFilterEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
