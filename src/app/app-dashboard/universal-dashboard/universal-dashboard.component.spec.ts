import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalDashboardComponent } from './universal-dashboard.component';

describe('UniversalDashboardComponent', () => {
  let component: UniversalDashboardComponent;
  let fixture: ComponentFixture<UniversalDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversalDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
