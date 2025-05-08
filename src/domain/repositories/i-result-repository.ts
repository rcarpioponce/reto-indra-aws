import { AppointmentResult } from "../models/appointment-result";

export interface IResultRepository {
  save(result: AppointmentResult): Promise<void>;
}
