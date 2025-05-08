export interface Appointment {
    id: string;
    insuredId: string;
    scheduleId: number;
    countryISO: "PE" | "CL";
    status: "pending" | "completed";
    createdAt: string;
}
