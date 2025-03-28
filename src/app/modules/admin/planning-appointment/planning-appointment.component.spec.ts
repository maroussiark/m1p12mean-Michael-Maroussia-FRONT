import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningAppointmentComponent } from './planning-appointment.component';

describe('PlanningAppointmentComponent', () => {
  let component: PlanningAppointmentComponent;
  let fixture: ComponentFixture<PlanningAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
