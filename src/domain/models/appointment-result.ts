export interface AppointmentResult {
  id: string;
  insuredId: string;
  scheduleId: number;
  countryISO: "PE" | "CL";
  status: "SUCCESS" | "FAILURE";
}
