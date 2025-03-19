export interface Appointment {
  id: number;
  service: string;
  date: Date;
  time: string;
  status: string;
  additionalDetails?: string;
}
