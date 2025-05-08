import AWS from "aws-sdk";
import { IAppointmentEventPublisher } from "../../domain/events/i-appointment-event-publisher";
import { AppointmentInput } from "../../application/dto/appointment-input.dto";

export class SnsAppointmentPublisher implements IAppointmentEventPublisher {
  private readonly sns = new AWS.SNS();
  private readonly topicArn = process.env.SNS_TOPIC;

  async publish(input: AppointmentInput & { id?: string }): Promise<void> {
    if (!this.topicArn) {
      console.error("❌ SNS_TOPIC no está definido en las variables de entorno.");
      throw new Error("SNS_TOPIC no definido");
    }

    try {
      const message = JSON.stringify(input);

      await this.sns
        .publish({
          TopicArn: this.topicArn,
          Message: message,
          MessageAttributes: {
            countryISO: {
              DataType: "String",
              StringValue: input.countryISO,
            },
          },
        })
        .promise();

      console.log("📣 Mensaje publicado correctamente en SNS:", input);
    } catch (error) {
      console.error("❌ Error publicando en SNS:", error);
      throw error;
    }
  }
}
