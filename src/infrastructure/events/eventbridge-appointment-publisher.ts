import AWS from "aws-sdk";
import { IAppointmentEventPublisher } from "../../domain/events/i-appointment-event-publisher";
import { AppointmentInput } from "../../application/dto/appointment-input.dto";
import { Appointment } from "../../domain/models/appointment";

const eventBridge = new AWS.EventBridge();
const eventBusName = process.env.EVENT_BUS_NAME || "MyEventBus";

export class EventBridgeAppointmentPublisher implements IAppointmentEventPublisher {
  async publish(input: AppointmentInput & { id: string }): Promise<void> {
    const event = {
      id: input.id,
      insuredId: input.insuredId,
      scheduleId: Number(input.scheduleId),
      countryISO: input.countryISO,
      status: "SUCCESS",
    };

    await eventBridge
      .putEvents({
        Entries: [
          {
            Source: "appointment_pe",
            DetailType: "event_update_appointment",
            Detail: JSON.stringify(event),
            EventBusName: eventBusName,
          },
        ],
      })
      .promise();

    console.log("📡 Evento publicado en EventBridge:", event);
  }
}
