import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBoComponent } from './login-bo.component';

describe('LoginBoComponent', () => {
  let component: LoginBoComponent;
  let fixture: ComponentFixture<LoginBoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginBoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginBoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
