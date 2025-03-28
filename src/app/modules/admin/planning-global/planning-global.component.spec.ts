import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningGlobalComponent } from './planning-global.component';

describe('PlanningGlobalComponent', () => {
  let component: PlanningGlobalComponent;
  let fixture: ComponentFixture<PlanningGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningGlobalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
