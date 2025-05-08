import { AppointmentInput } from "../../application/dto/appointment-input.dto";

export interface IAppointmentEventPublisher {
  publish(input: AppointmentInput): Promise<void>;
}
