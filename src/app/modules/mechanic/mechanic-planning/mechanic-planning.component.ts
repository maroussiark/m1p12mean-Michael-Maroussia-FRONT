import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Availability {
  day: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-mechanic-planning',
  templateUrl: './mechanic-planning.component.html',
  styleUrls: ['./mechanic-planning.component.scss'],
  standalone: false
})
export class MechanicPlanningComponent implements OnInit {
  planningForm!: FormGroup;
  availabilities: Availability[] = [];
  daysOfWeek: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.planningForm = this.fb.group({
      day: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  addAvailability(): void {
    if (this.planningForm.valid) {
      this.availabilities.push(this.planningForm.value);
      this.planningForm.reset();
    }
  }

  removeAvailability(index: number): void {
    this.availabilities.splice(index, 1);
  }
}
