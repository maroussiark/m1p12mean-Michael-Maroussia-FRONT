import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMechanicComponent } from './dashboard-mechanic.component';

describe('DashboardMechanicComponent', () => {
  let component: DashboardMechanicComponent;
  let fixture: ComponentFixture<DashboardMechanicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardMechanicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMechanicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
