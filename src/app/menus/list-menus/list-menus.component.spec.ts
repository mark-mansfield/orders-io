import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMenusComponent } from './list-menus.component';

describe('ListMenusComponent', () => {
  let component: ListMenusComponent;
  let fixture: ComponentFixture<ListMenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
