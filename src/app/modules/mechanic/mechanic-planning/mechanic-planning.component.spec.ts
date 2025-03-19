import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicPlanningComponent } from './mechanic-planning.component';

describe('MechanicPlanningComponent', () => {
  let component: MechanicPlanningComponent;
  let fixture: ComponentFixture<MechanicPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechanicPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
